import * as React from 'react';
import { Collection, CollectionTile, Timekeeper } from '../../../../common/models/index';
export interface CollectionOverviewProps extends React.Props<any> {
    timekeeper: Timekeeper;
    collection: Collection;
    collectionId?: string;
    onReorder?: (oldIndex: number, newIndex: number) => void;
    onDelete?: (collection: Collection, tile: CollectionTile) => void;
    editionMode?: boolean;
}
export interface CollectionOverviewState {
    collection?: Collection;
    draggedTile?: CollectionTile;
    dropIndex?: number;
    dropAfter?: boolean;
}
export declare class CollectionOverview extends React.Component<CollectionOverviewProps, CollectionOverviewState> {
    constructor();
    onExpand(tile: CollectionTile): void;
    dragStart(tile: CollectionTile, e: __React.DragEvent): void;
    shouldDropAfter(e: __React.DragEvent): boolean;
    dragOver(tile: CollectionTile, e: __React.DragEvent): void;
    dragEnd(e: __React.DragEvent): void;
    renderTile(tile: CollectionTile, i: number): JSX.Element;
    renderEmpty(): JSX.Element;
    render(): JSX.Element;
}
