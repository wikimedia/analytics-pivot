import * as React from 'react';
import { Fn } from '../../../common/utils/general/general';
import { User, Customization } from '../../../common/models/index';
export interface UserMenuProps extends React.Props<any> {
    openOn: Element;
    onClose: Fn;
    user: User;
    customization: Customization;
}
export interface UserMenuState {
}
export declare class UserMenu extends React.Component<UserMenuProps, UserMenuState> {
    constructor();
    render(): JSX.Element;
}
