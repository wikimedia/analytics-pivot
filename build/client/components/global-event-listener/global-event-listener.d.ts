import * as React from 'react';
export interface GlobalEventListenerProps extends React.Props<any> {
    resize?: () => void;
    scroll?: () => void;
    mouseDown?: (e: MouseEvent) => void;
    mouseMove?: (e: MouseEvent) => void;
    mouseUp?: (e: MouseEvent) => void;
    keyDown?: (e: KeyboardEvent) => void;
    enter?: (e: KeyboardEvent) => void;
    escape?: (e: KeyboardEvent) => void;
    right?: (e: KeyboardEvent) => void;
    left?: (e: KeyboardEvent) => void;
}
export interface GlobalEventListenerState {
}
export declare class GlobalEventListener extends React.Component<GlobalEventListenerProps, GlobalEventListenerState> {
    mounted: boolean;
    private propsToEvents;
    constructor();
    componentWillReceiveProps(nextProps: GlobalEventListenerProps): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    refreshListeners(nextProps: any, currentProps?: any): void;
    addListener(event: string): void;
    removeListener(event: string): void;
    onResize(): void;
    onScroll(): void;
    onMousedown(e: MouseEvent): void;
    onMousemove(e: MouseEvent): void;
    onMouseup(e: MouseEvent): void;
    onKeydown(e: KeyboardEvent): void;
    render(): JSX.Element;
}
