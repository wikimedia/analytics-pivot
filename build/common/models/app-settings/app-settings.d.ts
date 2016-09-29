import { Instance } from 'immutable-class';
import { Executor } from 'plywood';
import { Cluster, ClusterJS } from '../cluster/cluster';
import { Customization, CustomizationJS } from '../customization/customization';
import { DataCube, DataCubeJS } from '../data-cube/data-cube';
import { Collection, CollectionJS } from '../collection/collection';
import { Manifest } from '../manifest/manifest';
export interface AppSettingsValue {
    version?: number;
    clusters?: Cluster[];
    customization?: Customization;
    dataCubes?: DataCube[];
    linkViewConfig?: Collection;
    collections?: Collection[];
}
export interface AppSettingsJS {
    version?: number;
    clusters?: ClusterJS[];
    customization?: CustomizationJS;
    dataCubes?: DataCubeJS[];
    linkViewConfig?: CollectionJS;
    collections?: CollectionJS[];
}
export interface AppSettingsContext {
    visualizations: Manifest[];
    executorFactory?: (dataCube: DataCube) => Executor;
}
export declare class AppSettings implements Instance<AppSettingsValue, AppSettingsJS> {
    static BLANK: AppSettings;
    static isAppSettings(candidate: any): candidate is AppSettings;
    static fromJS(parameters: AppSettingsJS, context?: AppSettingsContext): AppSettings;
    version: number;
    clusters: Cluster[];
    customization: Customization;
    dataCubes: DataCube[];
    linkViewConfig: Collection;
    collections: Collection[];
    constructor(parameters: AppSettingsValue);
    valueOf(): AppSettingsValue;
    toJS(): AppSettingsJS;
    toJSON(): AppSettingsJS;
    toString(): string;
    equals(other: AppSettings): boolean;
    toClientSettings(): AppSettings;
    getVersion(): number;
    getDataCubesForCluster(clusterName: string): DataCube[];
    getDataCube(dataCubeName: string): DataCube;
    addOrUpdateDataCube(dataCube: DataCube): AppSettings;
    addOrUpdateCollection(collection: Collection): AppSettings;
    deleteCollection(collection: Collection): AppSettings;
    addCollectionAt(collection: Collection, index: number): AppSettings;
    attachExecutors(executorFactory: (dataCube: DataCube) => Executor): AppSettings;
    changeCustomization(customization: Customization): AppSettings;
    changeClusters(clusters: Cluster[]): AppSettings;
    addCluster(cluster: Cluster): AppSettings;
    change(propertyName: string, newValue: any): AppSettings;
    changeDataCubes(dataCubes: DataCube[]): AppSettings;
    changeCollections(collections: Collection[]): AppSettings;
    addDataCube(dataCube: DataCube): AppSettings;
    filterDataCubes(fn: (dataCube: DataCube, index?: number, dataCubes?: DataCube[]) => boolean): AppSettings;
}
