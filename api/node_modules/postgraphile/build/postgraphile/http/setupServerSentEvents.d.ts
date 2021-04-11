import { CreateRequestHandlerOptions } from '../../interfaces';
import { PostGraphileResponse } from './frameworks';
/**
 * Sets the headers and streams a body for server-sent events (primarily used
 * by watch mode).
 *
 * @internal
 */
export default function setupServerSentEvents(res: PostGraphileResponse, options: CreateRequestHandlerOptions): void;
