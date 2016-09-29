import * as React from 'react';
import { Clicker, Essence, Timekeeper, SortOn } from '../../../common/models/index';
export interface PinboardPanelProps extends React.Props<any> {
    clicker: Clicker;
    essence: Essence;
    timekeeper: Timekeeper;
    getUrlPrefix?: () => string;
    style?: React.CSSProperties;
}
export interface PinboardPanelState {
    dragOver?: boolean;
}
export declare class PinboardPanel extends React.Component<PinboardPanelProps, PinboardPanelState> {
    constructor();
    canDrop(e: DragEvent): boolean;
    dragEnter(e: DragEvent): void;
    dragOver(e: DragEvent): void;
    dragLeave(e: DragEvent): void;
    drop(e: DragEvent): void;
    getColorsSortOn(): SortOn;
    onLegendSortOnSelect(sortOn: SortOn): void;
    onPinboardSortOnSelect(sortOn: SortOn): void;
    onRemoveLegend(): void;
    render(): JSX.Element;
}
