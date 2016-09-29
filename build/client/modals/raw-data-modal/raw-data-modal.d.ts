import * as React from 'react';
import { List } from 'immutable';
import { Dataset, AttributeInfo } from 'plywood';
import { Essence, Stage, DataCube, Timekeeper } from '../../../common/models/index';
import { Fn } from '../../../common/utils/general/general';
export interface RawDataModalProps extends React.Props<any> {
    onClose: Fn;
    essence: Essence;
    timekeeper: Timekeeper;
}
export interface RawDataModalState {
    dataset?: Dataset;
    error?: Error;
    loading?: boolean;
    scrollLeft?: number;
    scrollTop?: number;
    stage?: Stage;
}
export declare class RawDataModal extends React.Component<RawDataModalProps, RawDataModalState> {
    mounted: boolean;
    constructor();
    componentDidMount(): void;
    componentWillUnmount(): void;
    fetchData(essence: Essence, timekeeper: Timekeeper): void;
    globalResizeListener(): void;
    onScroll(scrollTop: number, scrollLeft: number): void;
    getStringifiedFilters(): List<string>;
    getSortedAttributes(dataCube: DataCube): AttributeInfo[];
    renderFilters(): List<JSX.Element>;
    renderHeader(): JSX.Element[];
    getVisibleIndices(rowCount: number, height: number): number[];
    renderRows(): JSX.Element[];
    render(): JSX.Element;
}
