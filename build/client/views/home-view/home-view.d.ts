import * as React from 'react';
import { Collection, DataCube, User, Customization } from '../../../common/models/index';
import { Fn } from '../../../common/utils/general/general';
export interface HomeViewProps extends React.Props<any> {
    dataCubes?: DataCube[];
    collections?: Collection[];
    user?: User;
    onNavClick?: Fn;
    onOpenAbout: Fn;
    customization?: Customization;
    collectionsDelegate?: {
        addCollection: (collection: Collection) => void;
    };
}
export interface HomeViewState {
    showAddCollectionModal?: boolean;
}
export declare class HomeView extends React.Component<HomeViewProps, HomeViewState> {
    constructor();
    goToItem(item: DataCube | Collection): void;
    goToSettings(): void;
    renderSettingsIcon(): JSX.Element;
    renderItem(item: DataCube | Collection): JSX.Element;
    renderItems(items: (DataCube | Collection)[], adder?: JSX.Element): JSX.Element;
    createCollection(): void;
    renderAddCollectionModal(): JSX.Element;
    renderDataCubes(): JSX.Element;
    renderCollections(): JSX.Element;
    render(): JSX.Element;
}
