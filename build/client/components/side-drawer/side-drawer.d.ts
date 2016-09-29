import * as React from 'react';
import { Fn } from '../../../common/utils/general/general';
import { DataCube, Customization, User, Collection } from '../../../common/models/index';
export interface SideDrawerProps extends React.Props<any> {
    user: User;
    selectedItem: DataCube | Collection;
    collections: Collection[];
    dataCubes: DataCube[];
    onOpenAbout: Fn;
    onClose: Fn;
    customization?: Customization;
    itemHrefFn?: (oldItem?: DataCube | Collection, newItem?: DataCube | Collection) => string;
    viewType: 'home' | 'cube' | 'collection' | 'link' | 'settings' | 'no-data';
}
export interface SideDrawerState {
}
export declare class SideDrawer extends React.Component<SideDrawerProps, SideDrawerState> {
    constructor();
    componentDidMount(): void;
    componentWillUnmount(): void;
    globalMouseDownListener(e: MouseEvent): void;
    globalKeyDownListener(e: KeyboardEvent): void;
    onHomeClick(): void;
    onOpenSettings(): void;
    renderOverviewLink(): JSX.Element;
    renderItems(items: (DataCube | Collection)[], icon: string, urlPrefix?: string): JSX.Element;
    render(): JSX.Element;
}
