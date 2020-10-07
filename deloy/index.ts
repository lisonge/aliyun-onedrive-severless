/*
 * @Date: 2020-10-03 20:59:04
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-07 15:42:08
 */

import { promises as fs, readFileSync } from 'fs';
import OSS from 'ali-oss';
import fetch from 'node-fetch';
import TOML from '@iarna/toml';
// import yaml from 'js-yaml';
import { URLSearchParams } from 'url';
import { AssertionError } from 'assert';
// import { assert } from 'console';

// console.log(process.argv);
// process.exit();

function assert(value: boolean, message: string) {
    if (!value) {
        throw new AssertionError({
            message,
        });
    }
}

const account_id = process.argv[2];
const accessKey_id = process.argv[3];
const accessKey_secret = process.argv[4];

const code = {} as {
    refresh_token?: string;
    code?: string;
};

let grant_type = 'refresh_token';
if (process.argv.includes('--authorization_code')) {
    grant_type = 'authorization_code';
    code.code = process.argv[5];
} else {
    code.refresh_token = process.argv[5];
}
// '';

const config = TOML.parse(readFileSync('./config.toml', 'utf-8')) as {
    accessKey_id: string;
    accessKey_secret: string;
    account_id: string;
    allow_routes: string[];
    author: string;
    bucket: string;
    client_id: string;
    client_secret: string;
    oauth_file_name: string;
    redirect_uri: string;
    region: string;
};

let {
    region,
    bucket,
    oauth_file_name,
    client_id,
    client_secret,
    redirect_uri,
} = config;

if (region.startsWith('oss-')) {
    region = region.substring(4);
}

Object.assign(config, {
    account_id,
    accessKey_id,
    accessKey_secret,
});

// const template = yaml.safeLoad(readFileSync('./template.yml', 'utf8'));
// // @ts-ignore
// const { EnvironmentVariables } = template.Resources['aliyun-severless-b395ab'][
//     'onedrive-severless'
// ].Properties;
// Object.assign(EnvironmentVariables, {
//     account_Id: accountId,
//     accessKey_Id: accessKeyId,
//     accessKey_Secret: accessKeySecret,
//     region: `oss-${region}`,
//     bucket,
//     oauth_File_Name: oauthFileName,
//     client_id,
//     client_secret,
//     redirect_uri,
// });

const client = new OSS({
    region: `oss-${region}`,
    accessKeyId: accessKey_id,
    accessKeySecret: accessKey_secret,
    bucket,
});

const funToolEnv = {
    ACCOUNT_ID: account_id,
    ACCESS_KEY_ID: accessKey_id,
    ACCESS_KEY_SECRET: accessKey_secret,
    REGION: region,
    TIMEOUT: 30,
    RETRIES: 3,
};

async function main() {
    await client.listBuckets({ 'max-keys': 1 });
    // 账号信息不正确将会抛出异常

    const response = await fetch(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        {
            method: 'POST',
            body: new URLSearchParams({
                client_id,
                client_secret,
                redirect_uri,
                ...code,
                grant_type,
            }),
        }
    );
    const bf = await response.buffer();
    // assert(response.ok, bf.toString('utf-8'));
    const auth = JSON.parse(bf.toString('utf-8')) as {
        token_type: string;
        expires_in: number;
        scope: string;
        access_token: string;
        refresh_token: string;
    };
    const authOk = [
        'refresh_token',
        'token_type',
        'expires_in',
        'scope',
        'access_token',
    ].every((v) => v in auth);
    assert(authOk, JSON.stringify(auth));

    // 创建存储库并写入令牌文件
    try {
        await client.putBucket(bucket);
    } catch {}
    client.useBucket(bucket);
    await client.put(oauth_file_name, bf);

    const envText: string[] = [];
    for (const k in funToolEnv) {
        // @ts-ignore
        envText.push(`${k}=${funToolEnv[k]}`);
    }
    await fs.writeFile('./.env', envText.join('\n'), 'utf-8');
    // await fs.writeFile('./template.yml', yaml.safeDump(template), 'utf-8');
    await fs.writeFile('./config.toml', TOML.stringify(config), 'utf-8');
    console.log('finish project deloy init action');
}

main();
