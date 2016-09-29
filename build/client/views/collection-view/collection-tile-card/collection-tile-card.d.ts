import * as React from 'react';
import { CollectionTile, Stage, Timekeeper, DeviceSize } from '../../../../common/models/index';
export interface CollectionTileCardProps extends React.Props<any> {
    tile: CollectionTile;
    timekeeper: Timekeeper;
    className?: string;
    onExpand?: (tile: CollectionTile) => void;
    onDelete?: (tile: CollectionTile) => void;
    editionMode?: boolean;
    onDragOver?: (e: __React.DragEvent) => void;
    draggable?: boolean;
    onDragStart?: (e: __React.DragEvent) => void;
}
export interface CollectionTileCardState {
    visualizationStage?: Stage;
    deviceSize?: DeviceSize;
}
export declare class CollectionTileCard extends React.Component<CollectionTileCardProps, CollectionTileCardState> {
    constructor();
    componentDidMount(): void;
    updateVisualizationStage(): void;
    expand(): void;
    remove(): void;
    render(): JSX.Element;
}
