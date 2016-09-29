import { BaseImmutable, Property } from 'immutable-class';
export declare type Location = 'file' | 'mysql' | 'postgres';
export declare type Format = 'json' | 'yaml';
export interface SettingsLocationValue {
    location: Location;
    uri: string;
    table?: string;
    format?: Format;
    readOnly?: boolean;
}
export interface SettingsLocationJS {
    location: Location;
    uri: string;
    table?: string;
    format?: Format;
    readOnly?: boolean;
}
export declare class SettingsLocation extends BaseImmutable<SettingsLocationValue, SettingsLocationJS> {
    static LOCATION_VALUES: Location[];
    static DEFAULT_FORMAT: Format;
    static FORMAT_VALUES: Format[];
    static isSettingsLocation(candidate: any): candidate is SettingsLocation;
    static fromJS(parameters: SettingsLocationJS): SettingsLocation;
    static PROPERTIES: Property[];
    location: Location;
    uri: string;
    table: string;
    format: Format;
    readOnly: boolean;
    constructor(parameters: SettingsLocationValue);
    getLocation: () => Location;
    getUri: () => string;
    getTable: () => string;
    getFormat(): Format;
    getReadOnly: () => boolean;
}
