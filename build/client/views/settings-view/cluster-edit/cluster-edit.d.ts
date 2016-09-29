import * as React from 'react';
import { ImmutableFormState } from '../../../utils/immutable-form-delegate/immutable-form-delegate';
import { Cluster } from '../../../../common/models/index';
export interface ClusterEditProps extends React.Props<any> {
    cluster?: Cluster;
    onSave: (newCluster: Cluster) => void;
    isNewCluster?: boolean;
    onCancel?: () => void;
}
export declare class ClusterEdit extends React.Component<ClusterEditProps, ImmutableFormState<Cluster>> {
    private delegate;
    constructor();
    componentWillReceiveProps(nextProps: ClusterEditProps): void;
    initFromProps(props: ClusterEditProps): void;
    componentDidMount(): void;
    cancel(): void;
    save(): void;
    goBack(): void;
    renderGeneral(): JSX.Element;
    renderButtons(): JSX.Element;
    getTitle(): string;
    render(): JSX.Element;
}
