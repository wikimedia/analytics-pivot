import * as React from 'react';
import { Collection } from '../../../common/models/index';
import { ImmutableFormState } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export interface AddCollectionModalProps extends React.Props<any> {
    collections: Collection[];
    onCancel?: () => void;
    onSave?: (collection: Collection) => void;
}
export declare class AddCollectionModal extends React.Component<AddCollectionModalProps, ImmutableFormState<Collection>> {
    private delegate;
    constructor();
    initFromProps(props: AddCollectionModalProps): void;
    componentDidMount(): void;
    save(): void;
    isNameUnique(name: string): boolean;
    render(): JSX.Element;
}
