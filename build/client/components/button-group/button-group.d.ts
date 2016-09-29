import * as React from 'react';
import { Fn } from '../../../common/utils/general/general';
export interface GroupMember {
    title: string;
    onClick: Fn;
    key: string | number;
    className?: string;
    isSelected?: boolean;
}
export interface ButtonGroupProps extends React.Props<any> {
    groupMembers: GroupMember[];
    title?: string;
    className?: string;
}
export interface ButtonGroupState {
}
export declare class ButtonGroup extends React.Component<ButtonGroupProps, ButtonGroupState> {
    constructor();
    renderMembers(): JSX.Element[];
    render(): JSX.Element;
}
