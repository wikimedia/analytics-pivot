import * as React from 'react';
import { Collection, Essence, Timekeeper, CollectionTile, DataCube } from '../../../common/models/index';
import { ImmutableFormState } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export declare type CollectionMode = 'adding' | 'picking' | 'none';
export interface AddCollectionTileModalProps extends React.Props<any> {
    essence: Essence;
    timekeeper: Timekeeper;
    collection?: Collection;
    collections?: Collection[];
    dataCube: DataCube;
    onCancel?: () => void;
    onSave?: (collection: Collection, tile: CollectionTile) => void;
}
export interface AddCollectionTileModalState extends ImmutableFormState<CollectionTile> {
    collection?: Collection;
    collectionMode?: CollectionMode;
    convertToFixedTime?: boolean;
}
export declare class AddCollectionTileModal extends React.Component<AddCollectionTileModalProps, AddCollectionTileModalState> {
    private delegate;
    constructor();
    getTitleFromEssence(essence: Essence): string;
    initFromProps(props: AddCollectionTileModalProps): void;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: AddCollectionTileModalProps): void;
    save(): void;
    isItemNameUnique(collection: Collection, name: string): boolean;
    renderCollectionDropdown(): JSX.Element;
    renderCollectionPicker(): JSX.Element;
    toggleConvertToFixed(): void;
    render(): JSX.Element;
}
