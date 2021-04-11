import { PoolClient } from "pg";
import { ParsedSettings } from "./settings";
export interface Context {
    database: string;
}
export declare function clearAllPools(): void;
export declare type Client = PoolClient;
export declare function withClient<T = void>(connectionString: string, parsedSettings: ParsedSettings, callback: (pgClient: PoolClient, context: Context) => Promise<T>): Promise<T>;
export declare function withAdvisoryLock<T>(pgClient: PoolClient, callback: (pgClient: PoolClient) => Promise<T>): Promise<T>;
export declare function withTransaction<T>(pgClient: PoolClient, callback: () => Promise<T>): Promise<T>;
export declare function escapeIdentifier(str: string): string;
