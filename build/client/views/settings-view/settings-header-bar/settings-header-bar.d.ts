import * as React from 'react';
import { Fn } from '../../../../common/utils/general/general';
import { User, Customization } from '../../../../common/models/index';
export interface SettingsHeaderBarProps extends React.Props<any> {
    user?: User;
    onNavClick: Fn;
    customization?: Customization;
    title?: string;
}
export interface SettingsHeaderBarState {
    userMenuOpenOn?: Element;
}
export declare class SettingsHeaderBar extends React.Component<SettingsHeaderBarProps, SettingsHeaderBarState> {
    constructor();
    onUserMenuClick(e: MouseEvent): void;
    onUserMenuClose(): void;
    renderUserMenu(): JSX.Element;
    render(): JSX.Element;
}
