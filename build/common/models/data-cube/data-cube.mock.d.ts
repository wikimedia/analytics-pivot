import { DataCube, DataCubeJS } from './data-cube';
export declare class DataCubeMock {
    static readonly WIKI_JS: DataCubeJS;
    static readonly TWITTER_JS: DataCubeJS;
    static wiki(): DataCube;
    static twitter(): DataCube;
}
