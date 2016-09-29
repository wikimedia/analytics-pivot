/// <reference types="q" />
import * as Q from 'q';
import { External, Dataset } from 'plywood';
import { Logger } from 'logger-tracker';
import { TimeMonitor } from "../../../common/utils/time-monitor/time-monitor";
import { AppSettings, Timekeeper, Cluster } from '../../../common/models/index';
import { SettingsStore } from '../settings-store/settings-store';
import { FileManager } from '../file-manager/file-manager';
import { ClusterManager } from '../cluster-manager/cluster-manager';
export interface SettingsManagerOptions {
    logger: Logger;
    verbose?: boolean;
    initialLoadTimeout?: number;
    anchorPath: string;
}
export interface GetSettingsOptions {
    dataCubeOfInterest?: string;
    timeout?: number;
}
export declare class SettingsManager {
    logger: Logger;
    verbose: boolean;
    anchorPath: string;
    settingsStore: SettingsStore;
    appSettings: AppSettings;
    timeMonitor: TimeMonitor;
    fileManagers: FileManager[];
    clusterManagers: ClusterManager[];
    currentWork: Q.Promise<any>;
    initialLoadTimeout: number;
    constructor(settingsStore: SettingsStore, options: SettingsManagerOptions);
    isStateful(): boolean;
    private getClusterManagerFor(clusterName);
    private addClusterManager(cluster, dataCubes);
    private removeClusterManager(cluster);
    private getFileManagerFor(uri);
    private addFileManager(dataCube);
    private removeFileManager(dataCube);
    getTimekeeper(): Timekeeper;
    getSettings(opts?: GetSettingsOptions): Q.Promise<AppSettings>;
    reviseSettings(newSettings: AppSettings): Q.Promise<any>;
    reviseClusters(newSettings: AppSettings): Q.Promise<any>;
    reviseDataCubes(newSettings: AppSettings): Q.Promise<any>;
    updateSettings(newSettings: AppSettings): Q.Promise<any>;
    generateDataCubeName(external: External): string;
    onDatasetChange(dataCubeName: string, changedDataset: Dataset): void;
    onExternalChange(cluster: Cluster, dataCubeName: string, changedExternal: External): Q.Promise<any>;
}
