/*
 * @Date: 2020-10-01 15:28:35
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-07 16:12:03
 */

import OSS from 'ali-oss';
import fetch from 'node-fetch';
import { OauthToken } from './types';
import { URLSearchParams } from 'url';
// import { assert } from 'console';
import { globalConfig } from './common';

const {
    accessKey_id,
    accessKey_secret,
    bucket,
    client_id,
    client_secret,
    oauth_file_name,
    redirect_uri,
} = globalConfig;
let { region } = globalConfig;
if (!region.startsWith('oss-')) {
    region = 'oss-' + region;
}
const client = new OSS({
    region,
    accessKeyId: accessKey_id,
    accessKeySecret: accessKey_secret,
    bucket,
});
client.useBucket(bucket);
const oauth = {} as OauthToken;

async function syncRemoteToken(data?: OauthToken) {
    const o = data ?? oauth;
    await client.put(oauth_file_name, Buffer.from(JSON.stringify(o), 'utf-8'));
}
async function syncLocalToken(data?: OauthToken) {
    if (data) {
        Object.assign(oauth, data);
    } else {
        const result = await client.get(oauth_file_name);
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
