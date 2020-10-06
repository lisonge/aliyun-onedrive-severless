/*
 * @Date: 2020-10-01 15:28:35
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-06 18:50:19
 */

import OSS from 'ali-oss';
import fetch from 'node-fetch';
import { OauthToken } from './types';
import { URLSearchParams } from 'url';
// import { assert } from 'console';

const accessKeyId = process.env['accessKey_Id']!;
const accessKeySecret = process.env['accessKey_Secret']!;

const client_id = process.env['client_id']!;
const client_secret = process.env['client_secret']!;
const redirect_uri = process.env['redirect_uri']!;

const region = process.env['region']!;
// oss-cn-hongkong
const bucket = process.env['bucket']!;
const oauthFileName = process.env['oauth_File_Name']!;

const client = new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
});
client.useBucket(bucket);
const oauth = {} as OauthToken;

async function syncRemoteToken(data?: OauthToken) {
    const o = data ?? oauth;
    await client.put(oauthFileName, Buffer.from(JSON.stringify(o), 'utf-8'));
}
async function syncLocalToken(data?: OauthToken) {
    if (data) {
        Object.assign(oauth, data);
    } else {
        const result = await client.get(oauthFileName);
        const content = result.content as Buffer;
        Object.assign(oauth, JSON.parse(content.toString('utf-8')));
    }
}
async function syncWithNewToken(data: OauthToken) {
    syncLocalToken(data);
    syncRemoteToken(data);
}

function getAuthHeaders() {
    return {
        Authorization: `${oauth.token_type}\x20${oauth.access_token}`,
        // ...headers,
    };
}
async function refreshToken() {
    const u = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
    const data = {
        client_id,
        redirect_uri,
        client_secret,
        refresh_token: oauth.refresh_token,
        grant_type: 'refresh_token',
    };
    const response = await fetch(u, {
        method: 'POST',
        body: new URLSearchParams(data),
    });
    // assert(response.ok, await response.text())
    syncWithNewToken(await response.json());
}

export { getAuthHeaders, refreshToken, syncLocalToken };
