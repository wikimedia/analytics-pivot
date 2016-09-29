import * as React from 'react';
export interface ItemCardProps extends React.Props<any> {
    title: string;
    count?: number;
    description: string;
    icon: string;
    onClick: () => void;
}
export interface ItemCardState {
}
export declare class ItemCard extends React.Component<ItemCardProps, ItemCardState> {
    static getNewItemCard(onClick: () => void): JSX.Element;
    render(): JSX.Element;
}
