import { Instance } from 'immutable-class';
import { CollectionTile, CollectionTileJS, CollectionTileContext } from '../index';
export interface CollectionValue {
    name: string;
    title?: string;
    description?: string;
    tiles: CollectionTile[];
}
export interface CollectionJS {
    name: string;
    title?: string;
    description?: string;
    tiles?: CollectionTileJS[];
    items?: CollectionTileJS[];
}
export declare type CollectionContext = CollectionTileContext;
export declare class Collection implements Instance<CollectionValue, CollectionJS> {
    static isCollection(candidate: any): candidate is Collection;
    static fromJS(parameters: CollectionJS, context?: CollectionContext): Collection;
    title: string;
    name: string;
    description: string;
    tiles: CollectionTile[];
    constructor(parameters: CollectionValue);
    valueOf(): CollectionValue;
    toJS(): CollectionJS;
    toJSON(): CollectionJS;
    toString(): string;
    equals(other: Collection): boolean;
    getDefaultTile(): CollectionTile;
    findByName(name: string): CollectionTile;
    isNameAvailable(name: string): boolean;
    deleteTile(item: CollectionTile): Collection;
    change(propertyName: string, newValue: any): Collection;
    updateTile(tile: CollectionTile): Collection;
    changeTiles(tiles: CollectionTile[]): Collection;
    changeTitle(title: string): Collection;
}
