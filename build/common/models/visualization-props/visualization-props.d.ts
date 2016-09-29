import { Dataset } from 'plywood';
import { Fn } from '../../utils/general/general';
import { Clicker, Stage, Essence, Timekeeper, DeviceSize } from '../index';
export interface VisualizationProps {
    clicker: Clicker;
    essence: Essence;
    timekeeper: Timekeeper;
    stage: Stage;
    openRawDataModal?: Fn;
    registerDownloadableDataset?: (dataset: Dataset) => void;
    deviceSize?: DeviceSize;
    isThumbnail?: boolean;
}
export interface DatasetLoad {
    loading?: boolean;
    dataset?: Dataset;
    error?: any;
}
