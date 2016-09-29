import * as React from 'react';
export interface FormLabelProps extends React.Props<any> {
    label?: string;
    helpText?: string;
    errorText?: string;
    isBubble?: boolean;
}
export interface FormLabelState {
    helpVisible?: boolean;
    hideHelpIfNoError?: boolean;
}
export declare class FormLabel extends React.Component<FormLabelProps, FormLabelState> {
    static dumbLabel(label: string): JSX.Element;
    static simpleGenerator(labels: any, errors: any, isBubble?: boolean): (name: string) => JSX.Element;
    constructor();
    componentWillReceiveProps(nextProps: FormLabelProps): void;
    onHelpClick(): void;
    renderIcon(): JSX.Element;
    renderAdditionalText(): JSX.Element;
    render(): JSX.Element;
}
