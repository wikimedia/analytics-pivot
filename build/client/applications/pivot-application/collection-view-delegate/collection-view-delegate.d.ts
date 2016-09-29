/// <reference types="q" />
import * as Q from 'q';
import { PivotApplication } from '../pivot-application.tsx';
import { Collection, CollectionTile, DataCube } from '../../../../common/models/index';
export declare class CollectionViewDelegate {
    private app;
    constructor(app: PivotApplication);
    private setState(state, callback?);
    private save(appSettings);
    private getSettings();
    private getTimekeeper();
    addCollection(collection: Collection): Q.Promise<string>;
    deleteTile(collection: Collection, tile: CollectionTile): void;
    addTile(collection: Collection, tile: CollectionTile, index?: number): Q.Promise<string>;
    duplicateTile(collection: Collection, tile: CollectionTile): Q.Promise<string>;
    createTile(collection: Collection, dataCube: DataCube): void;
    updateCollection(collection: Collection): Q.Promise<any>;
    deleteCollection(collection: Collection): Q.Promise<any>;
    updateTile(collection: Collection, tile: CollectionTile): Q.Promise<any>;
    editTile(collection: Collection, tile: CollectionTile): void;
}
