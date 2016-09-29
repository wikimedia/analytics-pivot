/// <reference types="q" />
import * as React from 'react';
import * as Q from 'q';
import { DataCube, User, Customization } from '../../../common/models/index';
import { Fn } from '../../../common/utils/general/general';
import { AppSettings, Cluster } from '../../../common/models/index';
export interface SettingsViewProps extends React.Props<any> {
    user?: User;
    customization?: Customization;
    onNavClick?: Fn;
    onSettingsChange?: (settings: AppSettings) => void;
}
export interface SettingsViewState {
    settings?: AppSettings;
    breadCrumbs?: string[];
    tempCluster?: Cluster;
    tempDataCube?: DataCube;
}
export declare class SettingsView extends React.Component<SettingsViewProps, SettingsViewState> {
    constructor();
    componentDidMount(): void;
    onSave(settings: AppSettings, okMessage?: string): Q.Promise<any>;
    selectTab(value: string): void;
    renderLeftButtons(breadCrumbs: string[]): JSX.Element[];
    onURLChange(breadCrumbs: string[]): void;
    createCluster(newCluster: Cluster): void;
    addCluster(newCluster: Cluster): void;
    backToClustersView(): void;
    updateCluster(newCluster: Cluster): void;
    createDataCube(newDataCube: DataCube): void;
    addDataCube(newDataCube: DataCube): void;
    backToDataCubesView(): void;
    updateDataCube(newDataCube: DataCube): void;
    render(): JSX.Element;
}
