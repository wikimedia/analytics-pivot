import * as React from 'react';
import { Fn } from '../../../../common/utils/general/general';
import { User, Customization } from '../../../../common/models/index';
export interface HomeHeaderBarProps extends React.Props<any> {
    user?: User;
    onNavClick: Fn;
    customization?: Customization;
    title?: string;
}
export interface HomeHeaderBarState {
    userMenuOpenOn?: Element;
}
export declare class HomeHeaderBar extends React.Component<HomeHeaderBarProps, HomeHeaderBarState> {
    constructor();
    onUserMenuClick(e: MouseEvent): void;
    onUserMenuClose(): void;
    renderUserMenu(): JSX.Element;
    render(): JSX.Element;
}
