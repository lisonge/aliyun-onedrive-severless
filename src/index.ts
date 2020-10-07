/*
 * @Date: 2020-09-29 20:40:59
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-07 16:16:39
 */

import { Context, Request, Response, Callback } from './types';
import { getAuthHeaders, refreshToken, syncLocalToken } from './auth';
import { matchAllowRoute } from './utils';
import getRawBody from 'raw-body';
import { URL } from 'url';
import fetch from 'node-fetch';
import { AssertionError } from 'assert';

const baseUrl = 'https://graph.microsoft.com';

export const initializer = async function (
    context: Context,
    callback: Callback
) {
    await syncLocalToken();
    callback(null, 'success');
};

export const handler = async (
    req: Request,
    resp: Response,
    context: Context
) => {
    const { path } = req;
    if (!matchAllowRoute(path)) {
        throw new AssertionError({
            message: `${path} is not allow path`,
        });
    }
    const u = new URL(baseUrl);
    u.pathname = path;
    for (const k in req.queries) {
        u.searchParams.set(k, req.queries[k]);
    }
    const body = {} as { body?: Buffer };
    if (req.method == 'POST') {
        body.body = await getRawBody(req);
    }
    let proxyResponse = await fetch(u, {
        method: req.method,
        headers: getAuthHeaders(),
        ...body,
    });
    if (!proxyResponse.ok) {
        await refreshToken();
        proxyResponse = await fetch(u, {
            method: req.method,
            headers: getAuthHeaders(),
            ...body,
        });
    }
    proxyResponse.headers.forEach((value, name) => {
        resp.setHeader(value, name);
    });
    resp.setStatusCode(proxyResponse.status);
    resp.send(await proxyResponse.buffer());
};
