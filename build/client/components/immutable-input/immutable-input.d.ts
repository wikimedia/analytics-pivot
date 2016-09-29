import * as React from 'react';
import { ChangeFn } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export declare type InputType = 'text' | 'textarea';
export interface ImmutableInputProps extends React.Props<any> {
    instance: any;
    className?: string;
    path: string;
    focusOnStartUp?: boolean;
    onChange?: ChangeFn;
    onInvalid?: (invalidString: string) => void;
    validator?: RegExp | ((str: string) => boolean);
    stringToValue?: (str: string) => any;
    valueToString?: (value: any) => string;
    type?: InputType;
}
export interface ImmutableInputState {
    myInstance?: any;
    invalidString?: string;
    validString?: string;
}
export declare class ImmutableInput extends React.Component<ImmutableInputProps, ImmutableInputState> {
    static defaultProps: {
        type: string;
        stringToValue: StringConstructor;
        valueToString: (value: any) => string;
    };
    static simpleGenerator(instance: any, changeFn: ChangeFn): (name: string, validator?: RegExp, focusOnStartUp?: boolean) => JSX.Element;
    private focusAlreadyGiven;
    constructor();
    initFromProps(props: ImmutableInputProps): void;
    reset(callback?: () => void): void;
    componentWillReceiveProps(nextProps: ImmutableInputProps): void;
    componentDidUpdate(): void;
    componentDidMount(): void;
    maybeFocus(): void;
    isValueValid(value: string): boolean;
    update(newString: string): void;
    onChange(event: KeyboardEvent): void;
    render(): JSX.Element;
}
