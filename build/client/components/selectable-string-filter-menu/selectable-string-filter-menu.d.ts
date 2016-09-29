import * as React from "react";
import { Dataset, Set } from "plywood";
import { Fn } from "../../../common/utils/general/general";
import { Clicker, Essence, Timekeeper, Filter, FilterClause, FilterMode, Dimension, Colors } from "../../../common/models/index";
export interface SelectableStringFilterMenuProps extends React.Props<any> {
    clicker: Clicker;
    dimension: Dimension;
    essence: Essence;
    timekeeper: Timekeeper;
    onClose: Fn;
    filterMode?: FilterMode;
    searchText: string;
    onClauseChange: (clause: FilterClause) => Filter;
}
export interface SelectableStringFilterMenuState {
    loading?: boolean;
    dataset?: Dataset;
    error?: any;
    fetchQueued?: boolean;
    selectedValues?: Set;
    promotedValues?: Set;
    colors?: Colors;
}
export declare class SelectableStringFilterMenu extends React.Component<SelectableStringFilterMenuProps, SelectableStringFilterMenuState> {
    mounted: boolean;
    collectTriggerSearch: Fn;
    constructor();
    fetchData(essence: Essence, timekeeper: Timekeeper, dimension: Dimension, searchText: string): void;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: SelectableStringFilterMenuProps): void;
    globalKeyDownListener(e: KeyboardEvent): void;
    constructFilter(): Filter;
    onValueClick(value: any, e: MouseEvent): void;
    onOkClick(): void;
    onCancelClick(): void;
    actionEnabled(): boolean;
    renderRows(): JSX.Element;
    render(): JSX.Element;
}
