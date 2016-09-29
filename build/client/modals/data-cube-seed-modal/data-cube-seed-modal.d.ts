import * as React from 'react';
import { DataCube, Cluster } from "../../../common/models/index";
import { ImmutableFormState } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export interface DataCubeSeedModalProps extends React.Props<any> {
    onNext: (newDataCube: DataCube, autoFill: boolean) => void;
    onCancel: () => void;
    dataCubes: DataCube[];
    clusters: Cluster[];
}
export interface DataCubeSeedModalState extends ImmutableFormState<DataCube> {
    autoFill?: boolean;
}
export declare class DataCubeSeedModal extends React.Component<DataCubeSeedModalProps, DataCubeSeedModalState> {
    private delegate;
    constructor();
    initFromProps(props: DataCubeSeedModalProps): void;
    componentWillreceiveProps(nextProps: DataCubeSeedModalProps): void;
    componentDidMount(): void;
    onNext(): void;
    toggleAutoFill(): void;
    render(): JSX.Element;
}
