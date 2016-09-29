import * as React from "react";
import { Fn } from "../../../common/utils/general/general";
import { Stage, Clicker, Essence, Timekeeper, Dimension, DragPosition } from "../../../common/models/index";
export interface FilterMenuProps extends React.Props<any> {
    essence: Essence;
    timekeeper: Timekeeper;
    clicker: Clicker;
    containerStage?: Stage;
    openOn: Element;
    dimension: Dimension;
    changePosition: DragPosition;
    onClose: Fn;
    inside?: Element;
}
export interface FilterMenuState {
}
export declare class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
    constructor();
    render(): JSX.Element;
}
