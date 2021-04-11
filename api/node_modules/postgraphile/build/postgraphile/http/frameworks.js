"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGraphileResponseFastify3 = exports.PostGraphileResponseKoa = exports.PostGraphileResponseNode = exports.PostGraphileResponse = void 0;
const stream_1 = require("stream");
/**
 * The base class for PostGraphile responses; collects headers, status code and
 * body, and then hands to the relevant adaptor at the correct time.
 */
class PostGraphileResponse {
    constructor() {
        this._headers = {};
        this._setHeaders = false;
        this.statusCode = 200;
    }
    _setHeadersOnce() {
        if (!this._setHeaders) {
            this._setHeaders = true;
            this.setHeaders(this.statusCode, this._headers);
        }
    }
    setHeader(header, value) {
        if (this._setHeaders) {
            throw new Error(`Cannot set a header '${header}' when headers already sent`);
        }
        this._headers[header] = value;
    }
    /**
     * Use `endWithStream` or `end`; not both.
     */
    endWithStream() {
        if (this._body != null) {
            throw new Error("Cannot return a stream when there's already a response body");
        }
        this._setHeadersOnce();
        this._body = new stream_1.PassThrough();
        this.setBody(this._body);
        return this._body;
    }
    /**
     * Use `endWithStream` or `end`; not both
     */
    end(moreBody) {
        if (moreBody) {
            if (this._body != null) {
                if (typeof this._body === 'string') {
                    if (Buffer.isBuffer(moreBody)) {
                        throw new Error('Cannot mix string and buffer');
                    }
                    this._body = this._body + moreBody;
                }
                else if (Buffer.isBuffer(this._body)) {
                    if (typeof moreBody === 'string') {
                        throw new Error('Cannot mix buffer and string');
                    }
                    this._body = Buffer.concat([this._body, moreBody]);
                }
                else {
                    throw new Error("Can't `.end(string)` when body is a stream");
                }
            }
            else {
                this._body = moreBody;
            }
        }
        // If possible, set Content-Length to avoid unnecessary chunked encoding
        if (typeof this._body === 'string') {
            // String length is not reliable due to multi-byte characters; calculate via Buffer
            this.setHeader('Content-Length', String(Buffer.byteLength(this._body, 'utf8')));
        }
        else if (Buffer.isBuffer(this._body)) {
            this.setHeader('Content-Length', String(this._body.byteLength));
        }
        this._setHeadersOnce();
        this.setBody(this._body);
    }
}
exports.PostGraphileResponse = PostGraphileResponse;
/**
 * Suitable for Node's HTTP server, but also connect, express, restify and fastify v2.
 */
class PostGraphileResponseNode extends PostGraphileResponse {
    constructor(req, res, next) {
        super();
        this._req = req;
        this._res = res;
        this._next = next;
    }
    getNodeServerRequest() {
        return this._req;
    }
    getNodeServerResponse() {
        return this._res;
    }
    getNextCallback() {
        return this._next;
    }
    setHeaders(statusCode, headers) {
        for (const key in headers) {
            if (Object.hasOwnProperty.call(headers, key)) {
                this._res.setHeader(key, headers[key]);
            }
        }
        this._res.statusCode = statusCode;
    }
    setBody(body) {
        if (typeof body === 'string') {
            this._res.end(body);
        }
        else if (Buffer.isBuffer(body)) {
            this._res.end(body);
        }
        else if (!body) {
            this._res.end();
        }
        else {
            // Must be a stream
            // It'd be really nice if we could just:
            //
            //   body.pipe(this._res);
            //
            // however we need to support running within the compression middleware
            // which requires special handling for server-sent events:
            // https://github.com/expressjs/compression#server-sent-events
            //
            // Because of this, we must handle the data streaming manually so we can
            // flush:
            const writeData = (data) => {
                this._res.write(data);
                // Technically we should see if `.write()` returned false, and if so we
                // should pause the stream. However, since our stream is coming from
                // watch mode, we find it unlikely that a significant amount of data
                // will be buffered (and we don't recommend watch mode in production),
                // so it doesn't feel like we need this currently. If it turns out you
                // need this, a PR would be welcome.
                if (typeof this._res.flush === 'function') {
                    // https://github.com/expressjs/compression#server-sent-events
                    this._res.flush();
                }
                else if (typeof this._res.flushHeaders === 'function') {
                    this._res.flushHeaders();
                }
            };
            let clean = false;
            const cleanup = () => {
                if (clean)
                    return;
                clean = true;
                body.removeListener('data', writeData);
                body.removeListener('end', cleanup);
                this._req.removeListener('close', cleanup);
                this._req.removeListener('end', cleanup);
                this._req.removeListener('error', cleanup);
            };
            body.on('data', writeData);
            body.on('end', () => {
                cleanup();
                this._res.end();
            });
            this._req.on('close', cleanup);
            this._req.on('end', cleanup);
            this._req.on('error', cleanup);
        }
    }
}
exports.PostGraphileResponseNode = PostGraphileResponseNode;
/**
 * Suitable for Koa.
 */
class PostGraphileResponseKoa extends PostGraphileResponse {
    constructor(ctx, next) {
        super();
        this._ctx = ctx;
        this._next = next;
        const req = this.getNodeServerRequest();
        // For backwards compatibility, and to allow getting "back" to the Koa
        // context from pgSettings, etc (this is a documented interface)
        req._koaCtx = ctx;
        // Make `koa-bodyparser` trigger skipping of our `body-parser`
        if (ctx.request.body) {
            req._body = true;
            req.body = ctx.request.body;
        }
        // In case you're using koa-mount or similar
        req.originalUrl = ctx.request.originalUrl;
    }
    getNodeServerRequest() {
        return this._ctx.req;
    }
    getNodeServerResponse() {
        return this._ctx.res;
    }
    getNextCallback() {
        return this._next;
    }
    setHeaders(statusCode, headers) {
        this._ctx.status = statusCode;
        this._ctx.set(headers);
        // DO NOT `this._ctx.flushHeaders()` as it will interfere with the compress
        // middleware.
    }
    endWithStream() {
        // We're going to assume this is the EventStream which we want to
        // be realtime for watch mode, and there's no value in compressing it.
        this._ctx.compress = false;
        // TODO: find a better way of flushing the event stream on write.
        return super.endWithStream();
    }
    setBody(body) {
        this._ctx.body = body || '';
        this._next();
    }
}
exports.PostGraphileResponseKoa = PostGraphileResponseKoa;
/**
 * Suitable for Fastify v3 (use PostGraphileResponseNode and middleware
 * approach for Fastify v2)
 */
class PostGraphileResponseFastify3 extends PostGraphileResponse {
    constructor(request, reply) {
        super();
        this._request = request;
        this._reply = reply;
        // For backwards compatibility, and to allow getting "back" to the Fastify
        // request from pgSettings, etc
        const req = this.getNodeServerRequest();
        req._fastifyRequest = this._request;
        // Make Fastify's body parsing trigger skipping of our `body-parser`
        if (this._request.body) {
            req._body = true;
            req.body = this._request.body;
        }
    }
    getNodeServerRequest() {
        return this._request.raw;
    }
    getNodeServerResponse() {
        return this._reply.raw;
    }
    setHeaders(statusCode, headers) {
        this._reply.status(statusCode);
        this._reply.headers(headers);
    }
    endWithStream() {
        // We're going to assume this is the EventStream which we want to
        // be realtime for watch mode, and there's no value in compressing it.
        // Fastify will disable compression if we set the relevant request header
        // (see:
        // https://github.com/fastify/fastify-compress/blob/068c673fc0bd50da1f4d9f3fd2423b482c364a89/index.js#L217-L218)
        this._request.headers['x-no-compression'] = '1';
        // TODO: find a better way of flushing the event stream on write.
        return super.endWithStream();
    }
    setBody(body) {
        this._reply.send(body);
    }
}
exports.PostGraphileResponseFastify3 = PostGraphileResponseFastify3;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3Jrcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhpbGUvaHR0cC9mcmFtZXdvcmtzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUE2QztBQThEN0M7OztHQUdHO0FBQ0gsTUFBc0Isb0JBQW9CO0lBQTFDO1FBQ1UsYUFBUSxHQUFZLEVBQUUsQ0FBQztRQUV2QixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNyQixlQUFVLEdBQUcsR0FBRyxDQUFDO0lBd0UxQixDQUFDO0lBdEVTLGVBQWU7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUM7SUFFTSxTQUFTLENBQUMsTUFBYyxFQUFFLEtBQWE7UUFDNUMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLE1BQU0sNkJBQTZCLENBQUMsQ0FBQztTQUM5RTtRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7T0FFRztJQUNJLGFBQWE7UUFDbEIsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtZQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7U0FDaEY7UUFDRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG9CQUFXLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7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