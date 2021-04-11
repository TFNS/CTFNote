import { mixed } from '../../interfaces';
import { PoolClient } from 'pg';
export declare const $$pgClient = "pgClient";
/**
 * Retrieves a Postgres client from a context, throwing an error if such a
 * client does not exist.
 */
export default function getPgClientFromContext(context: mixed): PoolClient;
