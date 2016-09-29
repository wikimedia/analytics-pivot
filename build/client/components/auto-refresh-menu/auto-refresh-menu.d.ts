import * as React from 'react';
import { Duration, Timezone } from 'chronoshift';
import { Fn } from '../../../common/utils/general/general';
import { DataCube, Timekeeper } from '../../../common/models/index';
export interface AutoRefreshMenuProps extends React.Props<any> {
    openOn: Element;
    onClose: Fn;
    autoRefreshRate: Duration;
    setAutoRefreshRate: Fn;
    refreshMaxTime: Fn;
    dataCube: DataCube;
    timekeeper: Timekeeper;
    timezone: Timezone;
}
export interface AutoRefreshMenuState {
}
export declare class AutoRefreshMenu extends React.Component<AutoRefreshMenuProps, AutoRefreshMenuState> {
    constructor();
    onRefreshNowClick(): void;
    renderRefreshIntervalDropdown(): JSX.Element;
    render(): JSX.Element;
}
