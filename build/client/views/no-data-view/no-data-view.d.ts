import * as React from 'react';
import { User, Customization, AppSettings } from '../../../common/models/index';
import { Fn } from '../../../common/utils/general/general';
export declare type Mode = 'no-cluster' | 'no-cube';
export interface NoDataViewProps extends React.Props<any> {
    user?: User;
    appSettings?: AppSettings;
    onNavClick?: Fn;
    onOpenAbout: Fn;
    customization?: Customization;
    stateful: boolean;
}
export interface NoDataViewState {
    mode?: Mode;
}
export declare class NoDataView extends React.Component<NoDataViewProps, NoDataViewState> {
    static NO_CLUSTER: Mode;
    static NO_CUBE: Mode;
    constructor();
    componentWillReceiveProps(nextProps: NoDataViewProps): void;
    goToSettings(): void;
    renderSettingsIcon(): JSX.Element;
    renderTitle(mode: Mode): JSX.Element;
    renderLink(mode: Mode): JSX.Element;
    render(): JSX.Element;
}
