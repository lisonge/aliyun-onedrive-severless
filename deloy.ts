/*
 * @Date: 2020-10-03 20:59:04
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-05 03:01:15
 */

import { promises as fs, readFileSync } from 'fs';
import OSS from 'ali-oss';
import fetch from 'node-fetch';
import TOML from '@iarna/toml';
import yaml from 'js-yaml';
import { URLSearchParams } from 'url';
import { assert } from 'console';

// console.log(process.argv);
// process.exit();
const accountId = process.argv[2];
const accessKeyId = process.argv[3];
const accessKeySecret = process.argv[4];
const code = process.argv[5];

const grant_type = 'authorization_code';
// 'refresh_token';

const config = TOML.parse(readFileSync('./config.toml', 'utf-8')) as {
    region: string;
    bucket: string;
    oauthFileName: string;
    client_id: string;
    client_secret: string;
    redirect_uri: string;
};
const template = yaml.safeLoad(readFileSync('./template.yml', 'utf8'));

const {
    region,
    bucket,
    oauthFileName,
    client_id,
    client_secret,
    redirect_uri,
} = config;

// @ts-ignore
const { EnvironmentVariables } = template.Resources['aliyun-severless-b395ab'][
    'onedrive-severless'
].Properties;
Object.assign(EnvironmentVariables, {
    account_Id: accountId,
    accessKey_Id: accessKeyId,
    accessKey_Secret: accessKeySecret,
    region: `oss-${region}`,
    bucket,
    oauth_File_Name: oauthFileName,
    client_id,
    client_secret,
    redirect_uri,
});

const client = new OSS({
    region: `oss-${region}`,
    accessKeyId,
    accessKeySecret,
    bucket,
});

const deloyEnv = {
    ACCOUNT_ID: accountId,
    ACCESS_KEY_ID: accessKeyId,
    ACCESS_KEY_SECRET: accessKeySecret,
    REGION: region,
    TIMEOUT: 30,
    RETRIES: 3,
};

async function main() {
    await client.listBuckets({ 'max-keys': 1 });
    // 账号信息不正确将会抛出异常
    try {
        await client.putBucket(bucket);
    } catch {}
    client.useBucket(bucket);
    const response = await fetch(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        {
            method: 'POST',
            body: new URLSearchParams({
                client_id,
                client_secret,
                redirect_uri,
                code,
                grant_type,
            }),
        }
    );
    const bf = await response.buffer()
    // assert(response.ok, bf.toString('utf-8'));
    await client.put(oauthFileName, bf);

    const envText: string[] = [];
    for (const k in deloyEnv) {
        // @ts-ignore
        envText.push(`${k}=${deloyEnv[k]}`);
    }
    await fs.writeFile('./.env', envText.join('\n'), 'utf-8');
    await fs.writeFile('./template.yml', yaml.safeDump(template), 'utf-8');
    console.log('finish project deloy init action');
}

main();
