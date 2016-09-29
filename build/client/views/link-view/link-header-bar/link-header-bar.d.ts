import * as React from 'react';
import { Timezone } from 'chronoshift';
import { Fn } from '../../../../common/utils/general/general';
import { User, Customization } from '../../../../common/models/index';
export interface LinkHeaderBarProps extends React.Props<any> {
    title: string;
    user?: User;
    onNavClick: Fn;
    onExploreClick: Fn;
    getUrlPrefix?: () => string;
    customization?: Customization;
    changeTimezone?: (timezone: Timezone) => void;
    timezone?: Timezone;
    stateful: boolean;
}
export interface LinkHeaderBarState {
    settingsMenuOpenOn?: Element;
    userMenuOpenOn?: Element;
}
export declare class LinkHeaderBar extends React.Component<LinkHeaderBarProps, LinkHeaderBarState> {
    constructor();
    onUserMenuClick(e: MouseEvent): void;
    onUserMenuClose(): void;
    renderUserMenu(): JSX.Element;
    onSettingsMenuClick(e: MouseEvent): void;
    onSettingsMenuClose(): void;
    renderSettingsMenu(): JSX.Element;
    render(): JSX.Element;
}
