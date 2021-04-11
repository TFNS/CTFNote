/// <reference types="node" />
import { Server, IncomingMessage, ServerResponse } from 'http';
import { HttpRequestHandler } from '../../interfaces';
export declare function enhanceHttpServerWithWebSockets<Request extends IncomingMessage = IncomingMessage, Response extends ServerResponse = ServerResponse>(websocketServer: Server, postgraphileMiddleware: HttpRequestHandler, subscriptionServerOptions?: {
    keepAlive?: number;
    graphqlRoute?: string;
}): Promise<void>;
