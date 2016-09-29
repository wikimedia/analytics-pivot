import * as React from 'react';
import { Timezone } from 'chronoshift';
import { Fn } from '../../../common/utils/general/general';
import { DataCube, User } from '../../../common/models/index';
export interface SettingsMenuProps extends React.Props<any> {
    dataCube?: DataCube;
    openOn: Element;
    onClose: Fn;
    changeTimezone?: (timezone: Timezone) => void;
    timezone?: Timezone;
    timezones?: Timezone[];
    user?: User;
    stateful: boolean;
}
export interface SettingsMenuState {
}
export declare class SettingsMenu extends React.Component<SettingsMenuProps, SettingsMenuState> {
    constructor();
    changeTimezone(newTimezone: Timezone): void;
    renderSettingsLinks(): JSX.Element;
    renderTimezonesDropdown(): JSX.Element;
    render(): JSX.Element;
}
