/// <reference types="q" />
import * as Q from 'q';
import { AppSettings } from '../../../common/models/index';
import { Format } from '../../models/index';
export interface StateStore {
    readState: () => Q.Promise<string>;
    writeState: (state: string) => Q.Promise<any>;
}
export declare class SettingsStore {
    static fromTransient(initAppSettings: AppSettings): SettingsStore;
    static fromReadOnlyFile(filepath: string, format: Format): SettingsStore;
    static fromWritableFile(filepath: string, format: Format): SettingsStore;
    static fromStateStore(stateStore: StateStore): SettingsStore;
    readSettings: () => Q.Promise<AppSettings>;
    writeSettings: (appSettings: AppSettings) => Q.Promise<any>;
    constructor();
}
