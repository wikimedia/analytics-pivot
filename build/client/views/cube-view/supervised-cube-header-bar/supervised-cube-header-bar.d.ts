import * as React from 'react';
import { Timezone } from 'chronoshift';
import { Essence, Customization, ViewSupervisor } from '../../../../common/models/index';
export interface SupervisedCubeHeaderBarProps extends React.Props<any> {
    essence: Essence;
    supervisor: ViewSupervisor;
    customization?: Customization;
    changeTimezone?: (timezone: Timezone) => void;
    timezone?: Timezone;
}
export interface SupervisedCubeHeaderBarState {
    settingsMenuOpen?: Element;
    needsConfirmation?: boolean;
}
export declare class SupervisedCubeHeaderBar extends React.Component<SupervisedCubeHeaderBarProps, SupervisedCubeHeaderBarState> {
    constructor();
    onSettingsMenuClick(e: MouseEvent): void;
    onSettingsMenuClose(): void;
    renderSettingsMenu(): JSX.Element;
    onSave(): void;
    render(): JSX.Element;
}
