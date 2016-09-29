import * as React from 'react';
import { Fn } from '../../../common/utils/general/general';
import { Stage, Clicker, Essence, Timekeeper, Filter, FilterMode, Dimension, DragPosition, FilterClause } from '../../../common/models/index';
import { FilterOption } from "../filter-options-dropdown/filter-options-dropdown";
export interface StringFilterMenuProps extends React.Props<any> {
    clicker: Clicker;
    dimension: Dimension;
    essence: Essence;
    timekeeper: Timekeeper;
    changePosition: DragPosition;
    onClose: Fn;
    containerStage: Stage;
    openOn: Element;
    inside: Element;
}
export interface StringFilterMenuState {
    filterMode?: FilterMode;
    searchText?: string;
}
export declare class StringFilterMenu extends React.Component<StringFilterMenuProps, StringFilterMenuState> {
    mounted: boolean;
    constructor();
    componentWillMount(): void;
    onSelectFilterOption(filterMode: FilterMode): void;
    updateSearchText(searchText: string): void;
    updateFilter(clause: FilterClause): Filter;
    getFilterOptions(): FilterOption[];
    renderMenuControls(): JSX.Element;
    render(): JSX.Element;
}
