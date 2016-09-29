import * as React from 'react';
import { AppSettings, Cluster } from '../../../../common/models/index';
export interface ClustersProps extends React.Props<any> {
    settings?: AppSettings;
    onSave?: (settings: AppSettings, message?: string) => void;
}
export interface ClustersState {
    newSettings?: AppSettings;
}
export declare class Clusters extends React.Component<ClustersProps, ClustersState> {
    constructor();
    componentWillReceiveProps(nextProps: ClustersProps): void;
    editCluster(cluster: Cluster): void;
    startSeed(): void;
    renderEmpty(): JSX.Element;
    removeCluster(cluster: Cluster): void;
    render(): JSX.Element;
}
