/// <reference types="node" />
import { PassThrough, Stream } from 'stream';
import type { IncomingMessage, ServerResponse } from 'http';
/******************************************************************************/
export interface CompatFastifyReply {
    raw: ServerResponse;
    status(statusCode: number): CompatFastifyReply;
    headers(values: {
        [key: string]: any;
    }): CompatFastifyReply;
    send(payload?: any): CompatFastifyReply;
}
export interface CompatFastifyRequest {
    raw: IncomingMessage;
    body: unknown;
    readonly headers: {
        [key: string]: unknown;
    };
}
/******************************************************************************/
/******************************************************************************/
export interface CompatKoaContext {
    [key: string]: any;
    req: IncomingMessage;
    res: ServerResponse;
}
/******************************************************************************/
declare module 'http' {
    interface IncomingMessage {
        _koaCtx?: CompatKoaContext;
        _fastifyRequest?: CompatFastifyRequest;
        _body?: boolean;
        body?: any;
        originalUrl?: string;
    }
}
declare type Headers = {
    [header: string]: string;
};
/**
 * The base class for PostGraphile responses; collects headers, status code and
 * body, and then hands to the relevant adaptor at the correct time.
 */
export declare abstract class PostGraphileResponse {
    private _headers;
    private _body;
    private _setHeaders;
    statusCode: number;
    private _setHeadersOnce;
    setHeader(header: string, value: string): void;
    /**
     * Use `endWithStream` or `end`; not both.
     */
    endWithStream(): PassThrough;
    /**
     * Use `endWithStream` or `end`; not both
     */
    end(moreBody?: Buffer | string | null): void;
    /**
     * Returns the `res` object that the underlying HTTP server would have.
     */
    abstract getNodeServerRequest(): IncomingMessage;
    abstract getNodeServerResponse(): ServerResponse;
    abstract setHeaders(statusCode: number, headers: Headers): void;
    abstract setBody(body: Stream | Buffer | string | undefined): void;
}
/**
 * Suitable for Node's HTTP server, but also connect, express, restify and fastify v2.
 */
export declare class PostGraphileResponseNode extends PostGraphileResponse {
    private _req;
    private _res;
    private _next;
    constructor(req: IncomingMessage, res: ServerResponse, next: (e?: 'route' | Error) => void);
    getNodeServerRequest(): IncomingMessage;
    getNodeServerResponse(): ServerResponse;
    getNextCallback(): (e?: Error | "route" | undefined) => void;
    setHeaders(statusCode: number, headers: Headers): void;
    setBody(body: Stream | Buffer | string | undefined): void;
}
export declare type CompatKoaNext = (error?: Error) => Promise<any>;
/**
 * Suitable for Koa.
 */
export declare class PostGraphileResponseKoa extends PostGraphileResponse {
    private _ctx;
    private _next;
    constructor(ctx: CompatKoaContext, next: CompatKoaNext);
    getNodeServerRequest(): IncomingMessage;
    getNodeServerResponse(): ServerResponse;
    getNextCallback(): CompatKoaNext;
    setHeaders(statusCode: number, headers: Headers): void;
    endWithStream(): PassThrough;
    setBody(body: Stream | Buffer | string | undefined): void;
}
/**
 * Suitable for Fastify v3 (use PostGraphileResponseNode and middleware
 * approach for Fastify v2)
 */
export declare class PostGraphileResponseFastify3 extends PostGraphileResponse {
    private _request;
    private _reply;
    constructor(request: CompatFastifyRequest, reply: CompatFastifyReply);
    getNodeServerRequest(): IncomingMessage;
    getNodeServerResponse(): ServerResponse;
    setHeaders(statusCode: number, headers: Headers): void;
    endWithStream(): PassThrough;
    setBody(body: Stream | Buffer | string | undefined): void;
}
export {};
