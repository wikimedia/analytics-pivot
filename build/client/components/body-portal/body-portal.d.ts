import * as React from 'react';
export interface BodyPortalProps extends React.Props<any> {
    left?: number | string;
    top?: number | string;
    fullSize?: boolean;
    disablePointerEvents?: boolean;
    onMount?: () => void;
}
export interface BodyPortalState {
}
export declare class BodyPortal extends React.Component<BodyPortalProps, BodyPortalState> {
    private _target;
    private _component;
    constructor();
    readonly component: React.DOMComponent<any>;
    readonly target: any;
    updateStyle(): void;
    componentDidMount(): void;
    teleport(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): React.ReactElement<BodyPortalProps>;
}
