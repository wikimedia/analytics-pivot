import * as React from 'react';
import { Timezone } from 'chronoshift';
import { Fn } from '../../../common/utils/general/general';
import { FunctionSlot } from '../../utils/function-slot/function-slot';
import { Timekeeper, DataCube, Dimension, Essence, Stage, User, Customization, ViewSupervisor, DeviceSize } from '../../../common/models/index';
import { RawDataModal } from '../../modals/index';
export interface CubeViewLayout {
    dimensionPanelWidth: number;
    pinboardWidth: number;
}
export interface CubeViewProps extends React.Props<any> {
    initTimekeeper?: Timekeeper;
    maxFilters?: number;
    maxSplits?: number;
    user?: User;
    hash: string;
    updateViewHash: (newHash: string, force?: boolean) => void;
    getUrlPrefix?: () => string;
    dataCube: DataCube;
    onNavClick?: Fn;
    customization?: Customization;
    transitionFnSlot?: FunctionSlot<string>;
    supervisor?: ViewSupervisor;
    addEssenceToCollection?: (essence: Essence) => void;
    stateful: boolean;
}
export interface CubeViewState {
    essence?: Essence;
    timekeeper?: Timekeeper;
    visualizationStage?: Stage;
    menuStage?: Stage;
    dragOver?: boolean;
    showRawDataModal?: boolean;
    RawDataModalAsync?: typeof RawDataModal;
    layout?: CubeViewLayout;
    deviceSize?: DeviceSize;
    updatingMaxTime?: boolean;
}
export declare class CubeView extends React.Component<CubeViewProps, CubeViewState> {
    static defaultProps: {
        maxFilters: number;
        maxSplits: number;
    };
    mounted: boolean;
    private clicker;
    private downloadableDataset;
    constructor();
    refreshMaxTime(): void;
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: CubeViewProps): void;
    componentWillUpdate(nextProps: CubeViewProps, nextState: CubeViewState): void;
    componentWillUnmount(): void;
    getEssenceFromDataCube(dataCube: DataCube): Essence;
    getEssenceFromHash(dataCube: DataCube, hash: string): Essence;
    globalResizeListener(): void;
    canDrop(e: DragEvent): boolean;
    dragEnter(e: DragEvent): void;
    dragOver(e: DragEvent): void;
    dragLeave(e: DragEvent): void;
    drop(e: DragEvent): void;
    openRawDataModal(): void;
    onRawDataModalClose(): void;
    renderRawDataModal(): JSX.Element;
    triggerFilterMenu(dimension: Dimension): void;
    triggerSplitMenu(dimension: Dimension): void;
    changeTimezone(newTimezone: Timezone): void;
    getStoredLayout(): CubeViewLayout;
    storeLayout(layout: CubeViewLayout): void;
    onDimensionPanelResize(value: number): void;
    onPinboardPanelResize(value: number): void;
    onPanelResizeEnd(): void;
    onAddEssenceToCollection(): void;
    render(): JSX.Element;
}
