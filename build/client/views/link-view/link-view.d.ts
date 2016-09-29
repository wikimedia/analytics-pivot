import * as React from 'react';
import { Timezone } from 'chronoshift';
import { Fn } from '../../../common/utils/general/general';
import { Essence, Timekeeper, Stage, Collection, CollectionTile, User, Customization } from '../../../common/models/index';
import { Preset } from '../../components/index';
export interface LinkViewLayout {
    linkPanelWidth: number;
    pinboardWidth: number;
}
export interface LinkViewProps extends React.Props<any> {
    timekeeper: Timekeeper;
    collection: Collection;
    user?: User;
    hash: string;
    updateViewHash: (newHash: string) => void;
    changeHash: (newHash: string, force?: boolean) => void;
    getUrlPrefix?: () => string;
    onNavClick?: Fn;
    customization?: Customization;
    stateful: boolean;
}
export interface LinkViewState {
    linkTile?: CollectionTile;
    essence?: Essence;
    visualizationStage?: Stage;
    menuStage?: Stage;
    layout?: LinkViewLayout;
    deviceSize?: string;
}
export declare class LinkView extends React.Component<LinkViewProps, LinkViewState> {
    private clicker;
    constructor();
    componentWillMount(): void;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: LinkViewProps): void;
    componentWillUpdate(nextProps: LinkViewProps, nextState: LinkViewState): void;
    componentWillUnmount(): void;
    globalResizeListener(): void;
    selectLinkItem(linkTile: CollectionTile): void;
    goToCubeView(): void;
    changeTimezone(newTimezone: Timezone): void;
    getStoredLayout(): LinkViewLayout;
    storeLayout(layout: LinkViewLayout): void;
    onLinkPanelResize(value: number): void;
    onPinboardPanelResize(value: number): void;
    onPanelResizeEnd(): void;
    selectPreset(p: Preset): void;
    renderPresets(): JSX.Element;
    renderLinkPanel(style: React.CSSProperties): JSX.Element;
    render(): JSX.Element;
}
