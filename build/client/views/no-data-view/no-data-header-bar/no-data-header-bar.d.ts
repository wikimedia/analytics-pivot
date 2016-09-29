import * as React from 'react';
import { Fn } from '../../../../common/utils/general/general';
import { User, Customization } from '../../../../common/models/index';
export interface NoDataHeaderBarProps extends React.Props<any> {
    user?: User;
    onNavClick: Fn;
    customization?: Customization;
    title?: string;
}
export interface NoDataHeaderBarState {
    userMenuOpenOn?: Element;
}
export declare class NoDataHeaderBar extends React.Component<NoDataHeaderBarProps, NoDataHeaderBarState> {
    constructor();
    onUserMenuClick(e: MouseEvent): void;
    onUserMenuClose(): void;
    renderUserMenu(): JSX.Element;
    render(): JSX.Element;
}
