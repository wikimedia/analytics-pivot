import * as React from 'react';
import { ListItem, Cluster, DataCube } from '../../../../common/models/index';
import { ImmutableFormState } from '../../../utils/immutable-form-delegate/immutable-form-delegate';
export interface DataCubeEditProps extends React.Props<any> {
    isNewDataCube?: boolean;
    dataCube?: DataCube;
    clusters?: Cluster[];
    tab?: string;
    onSave: (newDataCube: DataCube) => void;
    onCancel?: () => void;
}
export interface DataCubeEditState extends ImmutableFormState<DataCube> {
    tab?: any;
}
export interface Tab {
    label: string;
    value: string;
    render: () => JSX.Element;
}
export declare class DataCubeEdit extends React.Component<DataCubeEditProps, DataCubeEditState> {
    private tabs;
    private delegate;
    constructor();
    componentWillReceiveProps(nextProps: DataCubeEditProps): void;
    componentDidMount(): void;
    initFromProps(props: DataCubeEditProps): void;
    selectTab(tab: Tab): void;
    renderTabs(activeTab: Tab): JSX.Element[];
    cancel(): void;
    save(): void;
    goBack(): void;
    getIntrospectionStrategies(): ListItem[];
    renderGeneral(): JSX.Element;
    renderAttributes(): JSX.Element;
    renderDimensions(): JSX.Element;
    renderMeasures(): JSX.Element;
    renderButtons(): JSX.Element;
    getTitle(): string;
    render(): JSX.Element;
}
