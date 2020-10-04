/*
 * @Date: 2020-09-29 21:15:02
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2020-10-03 18:43:25
 */

import stream from 'stream';
import internal from 'stream';

interface Credentials {
    accessKeyId: string;
    accessKeySecret: string;
    securityToken: string;
}

interface Function {
    name: string;
    handler: string;
    memory: number;
    timeout: number;
    initializer: string;
    initializationTimeout: number;
}

interface Service {
    name: string;
    logProject: string;
    logStore: string;
    qualifier: string;
    versionId: string;
}

// https://help.aliyun.com/document_detail/156876.html
export interface Context {
    requestId: string;
    credentials: Credentials;
    function: Function;
    service: Service;
    region: string;
    accountId: string;
}

// https://help.aliyun.com/document_detail/74757.html
export interface Request extends internal.Readable {
    headers: { [key: string]: string };
    path: string;
    queries: { [key: string]: string };
    url: string;
    clientIP: string;
    method: "GET"|"POST";
}

export interface Response {
    setStatusCode: (statusCode: number) => void;
    setHeader: (headerKey: string, headerValue: string) => void;
    deleteHeader: (headerKey: string) => void;
    send: (body: string | stream.Readable | Buffer) => void;
}
interface HandledInvocationError {}
// https://help.aliyun.com/document_detail/156876.html
export interface Callback {
    (error: null, data: Buffer): Buffer;
    (error: null, data: object): string;
    (error: null, data: Exclude<any, Buffer | object>): string;
    (error: NonNullable<any>, data: any): HandledInvocationError;
}
export interface OauthToken {
    token_type: string;
    scope: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}
