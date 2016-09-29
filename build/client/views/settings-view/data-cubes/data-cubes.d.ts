import * as React from 'react';
import { AppSettings, DataCube } from '../../../../common/models/index';
export interface DataCubesProps extends React.Props<any> {
    settings?: AppSettings;
    onSave?: (settings: AppSettings, message?: string) => void;
}
export interface DataCubesState {
    newSettings?: AppSettings;
    hasChanged?: boolean;
}
export declare class DataCubes extends React.Component<DataCubesProps, DataCubesState> {
    constructor();
    componentWillReceiveProps(nextProps: DataCubesProps): void;
    editCube(cube: DataCube): void;
    removeCube(cube: DataCube): void;
    startSeed(): void;
    renderEmpty(): JSX.Element;
    render(): JSX.Element;
}
