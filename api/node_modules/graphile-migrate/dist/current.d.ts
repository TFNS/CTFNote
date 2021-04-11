import { ParsedSettings } from "./settings";
export declare const VALID_FILE_REGEX: RegExp;
export interface CurrentMigrationLocation {
    isFile: boolean;
    path: string;
    exists: boolean;
}
export declare function getCurrentMigrationLocation(parsedSettings: ParsedSettings): Promise<CurrentMigrationLocation>;
export declare function readCurrentMigration(_parsedSettings: ParsedSettings, location: CurrentMigrationLocation): Promise<string>;
export declare function writeCurrentMigration(parsedSettings: ParsedSettings, location: CurrentMigrationLocation, body: string): Promise<void>;
