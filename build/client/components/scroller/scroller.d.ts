import * as React from 'react';
export declare type XSide = 'left' | 'right';
export declare type YSide = 'top' | 'bottom';
export declare type ScrollerPart = 'top-left-corner' | 'top-gutter' | 'top-right-corner' | 'left-gutter' | 'body' | 'right-gutter' | 'bottom-left-corner' | 'bottom-gutter' | 'bottom-right-corner';
export interface ScrollerLayout {
    bodyWidth: number;
    bodyHeight: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface ScrollerProps extends React.Props<any> {
    layout: ScrollerLayout;
    onClick?: (x: number, y: number, part: ScrollerPart) => void;
    onMouseMove?: (x: number, y: number, part: ScrollerPart) => void;
    onMouseLeave?: () => void;
    onScroll?: (scrollTop: number, scrollLeft: number) => void;
    topGutter?: JSX.Element | JSX.Element[];
    rightGutter?: JSX.Element | JSX.Element[];
    bottomGutter?: JSX.Element | JSX.Element[];
    leftGutter?: JSX.Element | JSX.Element[];
    topLeftCorner?: JSX.Element | JSX.Element[];
    topRightCorner?: JSX.Element | JSX.Element[];
    bottomRightCorner?: JSX.Element | JSX.Element[];
    bottomLeftCorner?: JSX.Element | JSX.Element[];
    body?: JSX.Element[];
    overlay?: JSX.Element | JSX.Element[];
}
export interface ScrollerState {
    scrollTop?: number;
    scrollLeft?: number;
    viewportHeight?: number;
    viewportWidth?: number;
}
export declare class Scroller extends React.Component<ScrollerProps, ScrollerState> {
    static TOP_LEFT_CORNER: ScrollerPart;
    static TOP_GUTTER: ScrollerPart;
    static TOP_RIGHT_CORNER: ScrollerPart;
    static LEFT_GUTTER: ScrollerPart;
    static BODY: ScrollerPart;
    static RIGHT_GUTTER: ScrollerPart;
    static BOTTOM_LEFT_CORNER: ScrollerPart;
    static BOTTOM_GUTTER: ScrollerPart;
    static BOTTOM_RIGHT_CORNER: ScrollerPart;
    static PARTS: ScrollerPart[][];
    constructor();
    globalResizeListener(): void;
    private getGutterStyle(side);
    private getCornerStyle(yPos, xPos);
    private getShadowStyle(side);
    getBodyStyle(): React.CSSProperties;
    getTargetStyle(): React.CSSProperties;
    private getDOMElement(refName);
    private onScroll(e);
    getRelativeMouseCoordinates(event: MouseEvent): {
        x: number;
        y: number;
        part: ScrollerPart;
    };
    onClick(event: MouseEvent): void;
    onMouseMove(event: MouseEvent): void;
    renderGutter(side: XSide | YSide): JSX.Element;
    shouldHaveShadow(side: XSide | YSide): boolean;
    renderShadow(side: XSide | YSide): JSX.Element;
    renderCorner(yPos: YSide, xPos: XSide): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    updateViewport(): void;
    render(): JSX.Element;
}
