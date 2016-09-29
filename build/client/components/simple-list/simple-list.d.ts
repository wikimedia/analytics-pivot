import * as React from 'react';
export interface SimpleRow {
    title: string;
    description?: string;
    icon?: string;
}
export interface SimpleListProps extends React.Props<any> {
    rows: SimpleRow[];
    onEdit?: (index: number) => void;
    onRemove?: (index: number) => void;
    onReorder?: (oldIndex: number, newIndex: number) => void;
}
export interface SimpleListState {
    draggedItem?: SimpleRow;
    dropIndex?: number;
}
export declare class SimpleList extends React.Component<SimpleListProps, SimpleListState> {
    constructor();
    dragStart(item: SimpleRow, e: DragEvent): void;
    isInTopHalf(e: DragEvent): boolean;
    dragOver(item: SimpleRow, e: DragEvent): void;
    dragEnd(e: DragEvent): void;
    renderRows(rows: SimpleRow[]): JSX.Element[];
    render(): JSX.Element;
}
