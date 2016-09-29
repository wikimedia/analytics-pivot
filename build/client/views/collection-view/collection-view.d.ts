/// <reference types="q" />
import * as React from 'react';
import * as Q from 'q';
import { Collection, Timekeeper, User, Customization, CollectionTile, DataCube } from '../../../common/models/index';
import { Fn } from '../../../common/utils/general/general';
export interface CollectionViewProps extends React.Props<any> {
    dataCubes: DataCube[];
    collections: Collection[];
    timekeeper: Timekeeper;
    user?: User;
    onNavClick?: Fn;
    customization?: Customization;
    delegate?: {
        updateCollection: (collection: Collection) => Q.Promise<any>;
        deleteCollection: (collection: Collection) => Q.Promise<any>;
        updateTile: (collection: Collection, tile: CollectionTile) => Q.Promise<any>;
        editTile: (collection: Collection, tile: CollectionTile) => void;
        duplicateTile: (collection: Collection, tile: CollectionTile) => Q.Promise<string>;
        createTile: (collection: Collection, dataCube: DataCube) => void;
        deleteTile: (collection: Collection, tile: CollectionTile) => void;
    };
}
export interface CollectionViewState {
    collection?: Collection;
    tempCollection?: Collection;
    editingOverview?: boolean;
}
export declare class CollectionView extends React.Component<CollectionViewProps, CollectionViewState> {
    private stickerId;
    constructor();
    onURLChange(crumbs: string[]): void;
    onTilesReorder(oldIndex: number, newIndex: number): void;
    onTilesDelete(collection: Collection, tile: CollectionTile): void;
    editCollection(): void;
    onCollectionTitleChange(newTitle: string): void;
    saveEdition(): void;
    cancelEdition(): void;
    render(): JSX.Element;
}
