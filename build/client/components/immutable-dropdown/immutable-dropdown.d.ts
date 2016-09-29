import * as React from 'react';
import { ListItem } from '../../../common/models/index';
import { ChangeFn } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export interface ImmutableDropdownProps<T> extends React.Props<any> {
    instance: any;
    path: string;
    label?: string;
    items: Array<T>;
    equal: (a: T, b: T) => boolean;
    renderItem: (a: T) => string;
    keyItem: (a: T) => any;
    onChange: ChangeFn;
}
export interface ImmutableDropdownState {
}
export declare class ImmutableDropdown<T> extends React.Component<ImmutableDropdownProps<T>, ImmutableDropdownState> {
    static specialize<U>(): new () => ImmutableDropdown<U>;
    static simpleGenerator(instance: any, changeFn: ChangeFn): (name: string, items: ListItem[]) => JSX.Element;
    constructor();
    onChange(newSelectedItem: T): void;
    render(): JSX.Element;
}
