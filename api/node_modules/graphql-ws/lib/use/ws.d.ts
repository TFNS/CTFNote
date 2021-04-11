/// <reference types="node" />
import type * as http from 'http';
import type * as ws from 'ws';
import { ServerOptions } from '../server';
import { Disposable } from '../types';
declare type WebSocket = typeof ws.prototype;
declare type WebSocketServer = ws.Server;
/**
 * The extra that will be put in the `Context`.
 */
export interface Extra {
    /**
     * The actual socket connection between the server and the client.
     */
    readonly socket: WebSocket;
    /**
     * The initial HTTP request before the actual
     * socket and connection is established.
     */
    readonly request: http.IncomingMessage;
}
/**
 * Use the server on a [ws](https://github.com/websockets/ws) ws server.
 * This is a basic starter, feel free to copy the code over and adjust it to your needs
 */
export declare function useServer(options: ServerOptions<Extra>, ws: WebSocketServer, 
/**
 * The timout between dispatched keep-alive messages. Internally uses the [ws Ping and Pongs]((https://developer.mozilla.org/en-US/docs/Web/API/wss_API/Writing_ws_servers#Pings_and_Pongs_The_Heartbeat_of_wss))
 * to check that the link between the clients and the server is operating and to prevent the link
 * from being broken due to idling.
 *
 * @default 12 * 1000 // 12 seconds
 */
keepAlive?: number): Disposable;
export {};
