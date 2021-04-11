/// <reference types="node" />
import { Pool, PoolConfig } from 'pg';
import { IncomingMessage, ServerResponse } from 'http';
import { GraphQLSchema } from 'graphql';
import { EventEmitter } from 'events';
import { PostGraphileOptions, HttpRequestHandler } from '../interfaces';
export interface PostgraphileSchemaBuilder<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse> {
    _emitter: EventEmitter;
    getGraphQLSchema: () => Promise<GraphQLSchema>;
    options: PostGraphileOptions<Request, Response>;
}
/**
 * Creates a PostGraphile Http request handler by first introspecting the
 * database to get a GraphQL schema, and then using that to create the Http
 * request handler.
 */
export declare function getPostgraphileSchemaBuilder<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse>(pgPool: Pool, schema: string | Array<string>, incomingOptions: PostGraphileOptions<Request, Response>, release?: null | (() => void)): PostgraphileSchemaBuilder;
export default function postgraphile<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse>(poolOrConfig?: Pool | PoolConfig | string, schema?: string | Array<string>, options?: PostGraphileOptions<Request, Response>): HttpRequestHandler;
export default function postgraphile<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse>(poolOrConfig?: Pool | PoolConfig | string, options?: PostGraphileOptions<Request, Response>): HttpRequestHandler;
