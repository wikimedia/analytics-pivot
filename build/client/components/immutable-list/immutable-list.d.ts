import * as React from 'react';
import { List } from 'immutable';
import { SimpleRow } from '../simple-list/simple-list';
export interface ImmutableListProps<T> extends React.Props<any> {
    label?: string;
    items: List<T>;
    onChange: (newItems: List<T>) => void;
    getNewItem: () => T;
    getModal: (item: T) => JSX.Element;
    getRows: (items: List<T>) => SimpleRow[];
}
export interface ImmutableListState<T> {
    tempItems?: List<T>;
    editedIndex?: number;
    pendingAddItem?: T;
}
export declare class ImmutableList<T> extends React.Component<ImmutableListProps<T>, ImmutableListState<T>> {
    static specialize<U>(): new () => ImmutableList<U>;
    constructor();
    editItem(index: number): void;
    addItem(): void;
    componentWillReceiveProps(nextProps: ImmutableListProps<T>): void;
    componentDidMount(): void;
    deleteItem(index: number): void;
    onReorder(oldIndex: number, newIndex: number): void;
    onChange(): void;
    renderEditModal(itemIndex: number): JSX.Element;
    renderAddModal(item: T): JSX.Element;
    render(): JSX.Element;
}
