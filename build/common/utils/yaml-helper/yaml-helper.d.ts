import { AttributeInfo } from 'plywood';
import { DataCube, Dimension, Measure, Cluster, AppSettings, Collection, CollectionTile } from '../../../common/models/index';
export declare function clusterToYAML(cluster: Cluster, withComments: boolean): string[];
export declare function collectionToYAML(collection: Collection, withComments: boolean): string[];
export declare function CollectionTileToYAML(item: CollectionTile): string[];
export declare function attributeToYAML(attribute: AttributeInfo): string[];
export declare function dimensionToYAML(dimension: Dimension): string[];
export declare function measureToYAML(measure: Measure): string[];
export declare function dataCubeToYAML(dataCube: DataCube, withComments: boolean): string[];
export interface Extra {
    header?: boolean;
    version?: string;
    verbose?: boolean;
    port?: number;
}
export declare function appSettingsToYAML(appSettings: AppSettings, withComments: boolean, extra?: Extra): string;
