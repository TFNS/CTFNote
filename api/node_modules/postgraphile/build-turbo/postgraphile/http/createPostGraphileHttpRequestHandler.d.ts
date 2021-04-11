import { HttpRequestHandler, CreateRequestHandlerOptions } from '../../interfaces';
export declare function isEmpty(value: any): boolean;
/**
 * Creates a GraphQL request handler that can support many different `http` frameworks, including:
 *
 * - Native Node.js `http`.
 * - `connect`.
 * - `express`.
 * - `koa` (2.0).
 */
export default function createPostGraphileHttpRequestHandler(options: CreateRequestHandlerOptions): HttpRequestHandler;
