import * as React from "react";
import { Dataset } from "plywood";
import { Fn } from "../../../common/utils/general/general";
import { Clicker, Essence, Timekeeper, Filter, FilterClause, FilterMode, Dimension } from "../../../common/models/index";
export interface PreviewStringFilterMenuProps extends React.Props<any> {
    clicker: Clicker;
    dimension: Dimension;
    essence: Essence;
    timekeeper: Timekeeper;
    onClose: Fn;
    filterMode: FilterMode;
    searchText: string;
    onClauseChange: (clause: FilterClause) => Filter;
}
export interface PreviewStringFilterMenuState {
    loading?: boolean;
    dataset?: Dataset;
    queryError?: any;
    fetchQueued?: boolean;
    regexErrorMessage?: string;
}
export declare class PreviewStringFilterMenu extends React.Component<PreviewStringFilterMenuProps, PreviewStringFilterMenuState> {
    mounted: boolean;
    collectTriggerSearch: Fn;
    constructor();
    fetchData(essence: Essence, timekeeper: Timekeeper, dimension: Dimension, searchText: string): void;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: PreviewStringFilterMenuProps): void;
    checkRegex(text: string): boolean;
    globalKeyDownListener(e: KeyboardEvent): void;
    constructFilter(): Filter;
    onOkClick(): void;
    onCancelClick(): void;
    actionEnabled(): boolean;
    renderRows(): JSX.Element;
    render(): JSX.Element;
}
