/// <reference types="q" />
import * as React from 'react';
import * as Q from 'q';
import { Collection, CollectionTile, Stage, Timekeeper } from '../../../../common/models/index';
export interface CollectionTileLightboxProps extends React.Props<any> {
    collection?: Collection;
    tileId?: string;
    timekeeper: Timekeeper;
    onEdit?: (collection: Collection, tile: CollectionTile) => void;
    onDelete?: (collection: Collection, tile: CollectionTile) => void;
    onDuplicate?: (collection: Collection, tile: CollectionTile) => Q.Promise<string>;
    onChange?: (collection: Collection, tile: CollectionTile) => Q.Promise<any>;
}
export interface CollectionTileLightboxState {
    tile?: CollectionTile;
    visualizationStage?: Stage;
    editMenuOpen?: boolean;
    moreMenuOpen?: boolean;
    editionMode?: boolean;
    tempTile?: CollectionTile;
}
export declare class CollectionTileLightbox extends React.Component<CollectionTileLightboxProps, CollectionTileLightboxState> {
    constructor();
    componentWillReceiveProps(nextProps: CollectionTileLightboxProps): void;
    updateStage(): void;
    onExplore(): void;
    onEditIconClick(): void;
    onMoreIconClick(): void;
    closeModal(): void;
    onEscape(): void;
    editTitleAndDesc(): void;
    renderEditMenu(): JSX.Element;
    renderMoreMenu(): JSX.Element;
    onMouseDown(e: MouseEvent): void;
    swipe(direction: number): void;
    onEnter(): void;
    saveEdition(): void;
    renderHeadBand(): JSX.Element;
    render(): JSX.Element;
}
