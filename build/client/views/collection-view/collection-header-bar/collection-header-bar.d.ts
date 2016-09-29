import * as React from 'react';
import { Fn } from '../../../../common/utils/general/general';
import { User, Customization, DataCube, Collection } from '../../../../common/models/index';
export interface CollectionHeaderBarProps extends React.Props<any> {
    user?: User;
    onNavClick: Fn;
    customization?: Customization;
    title?: string;
    dataCubes: DataCube[];
    collections: Collection[];
    onAddItem?: (dataCube: DataCube) => void;
    onEditCollection?: () => void;
    onDeleteCollection?: () => void;
    editionMode?: boolean;
    onCollectionTitleChange?: (newTitle: string) => void;
    onSave?: () => void;
    onCancel?: () => void;
}
export interface CollectionHeaderBarState {
    userMenuOpenOn?: Element;
    addMenuOpenOn?: Element;
    settingsMenuOpenOn?: Element;
}
export declare class CollectionHeaderBar extends React.Component<CollectionHeaderBarProps, CollectionHeaderBarState> {
    constructor();
    onUserMenuClick(e: MouseEvent): void;
    onUserMenuClose(): void;
    renderUserMenu(): JSX.Element;
    onAddClick(e: MouseEvent): void;
    onAddMenuClose(): void;
    onSettingsClick(e: MouseEvent): void;
    onSettingsMenuClose(): void;
    goToSettings(): void;
    renderSettingsMenu(): JSX.Element;
    renderAddMenu(): JSX.Element;
    getHeaderStyle(customization: Customization): React.CSSProperties;
    renderEditableBar(): JSX.Element;
    render(): JSX.Element;
}
