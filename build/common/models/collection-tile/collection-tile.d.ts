import { Instance } from 'immutable-class';
import { DataCube } from '../data-cube/data-cube';
import { Essence, EssenceJS } from '../essence/essence';
import { Manifest } from '../manifest/manifest';
export interface CollectionTileValue {
    name: string;
    title: string;
    description: string;
    group: string;
    dataCube: DataCube;
    essence: Essence;
}
export interface CollectionTileJS {
    name: string;
    title?: string;
    description?: string;
    group: string;
    dataCube: string;
    essence: EssenceJS;
}
export interface CollectionTileContext {
    dataCubes: DataCube[];
    visualizations?: Manifest[];
}
export declare class CollectionTile implements Instance<CollectionTileValue, CollectionTileJS> {
    static isCollectionTile(candidate: any): candidate is CollectionTile;
    static fromJS(parameters: CollectionTileJS, context?: CollectionTileContext): CollectionTile;
    name: string;
    title: string;
    description: string;
    group: string;
    dataCube: DataCube;
    essence: Essence;
    constructor(parameters: CollectionTileValue);
    valueOf(): CollectionTileValue;
    toJS(): CollectionTileJS;
    toJSON(): CollectionTileJS;
    toString(): string;
    equals(other: CollectionTile): boolean;
    change(propertyName: string, newValue: any): CollectionTile;
    changeEssence(essence: Essence): CollectionTile;
    changeName(name: string): CollectionTile;
    changeTitle(title: string): CollectionTile;
}
