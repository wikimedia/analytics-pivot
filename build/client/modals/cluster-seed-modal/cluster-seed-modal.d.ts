import * as React from 'react';
import { Cluster } from "../../../common/models/cluster/cluster";
import { ImmutableFormState } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export interface ClusterSeedModalProps extends React.Props<any> {
    onNext: (newCluster: Cluster) => void;
    onCancel: () => void;
    clusters: Cluster[];
}
export declare class ClusterSeedModal extends React.Component<ClusterSeedModalProps, ImmutableFormState<Cluster>> {
    private delegate;
    constructor();
    initFromProps(props: ClusterSeedModalProps): void;
    componentWillreceiveProps(nextProps: ClusterSeedModalProps): void;
    componentDidMount(): void;
    onNext(): void;
    render(): JSX.Element;
}
