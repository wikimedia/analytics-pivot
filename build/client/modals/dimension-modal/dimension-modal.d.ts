import * as React from 'react';
import { Dimension, ListItem } from '../../../common/models/index';
import { ImmutableFormState } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export interface DimensionModalProps extends React.Props<any> {
    dimension?: Dimension;
    onSave?: (dimension: Dimension) => void;
    onClose?: () => void;
}
export declare class DimensionModal extends React.Component<DimensionModalProps, ImmutableFormState<Dimension>> {
    static KINDS: ListItem[];
    static BUCKETING_STRATEGIES: {
        label: string;
        value: "defaultBucket" | "defaultNoBucket";
    }[];
    private delegate;
    constructor();
    initStateFromProps(props: DimensionModalProps): void;
    componentWillReceiveProps(nextProps: DimensionModalProps): void;
    componentDidMount(): void;
    save(): void;
    render(): JSX.Element;
}
