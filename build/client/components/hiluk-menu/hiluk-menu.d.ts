import * as React from 'react';
import { Dataset } from 'plywood';
import { Fn } from '../../../common/utils/general/general';
import { Essence, Timekeeper, ExternalView } from '../../../common/models/index';
export interface HilukMenuProps extends React.Props<any> {
    essence: Essence;
    timekeeper: Timekeeper;
    openOn: Element;
    onClose: Fn;
    getUrlPrefix: () => string;
    openRawDataModal: Fn;
    externalViews?: ExternalView[];
    getDownloadableDataset?: () => Dataset;
    addEssenceToCollection?: () => void;
}
export interface HilukMenuState {
    url?: string;
    specificUrl?: string;
}
export declare class HilukMenu extends React.Component<HilukMenuProps, HilukMenuState> {
    constructor();
    componentDidMount(): void;
    openRawDataModal(): void;
    onExport(): void;
    render(): JSX.Element;
}
