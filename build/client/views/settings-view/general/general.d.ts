import { Timezone } from 'chronoshift';
import * as React from 'react';
import { AppSettings } from '../../../../common/models/index';
import { ImmutableFormState } from '../../../utils/immutable-form-delegate/immutable-form-delegate';
export interface GeneralProps extends React.Props<any> {
    settings?: AppSettings;
    onSave?: (settings: AppSettings) => void;
}
export declare class General extends React.Component<GeneralProps, ImmutableFormState<AppSettings>> {
    private delegate;
    constructor();
    componentWillReceiveProps(nextProps: GeneralProps): void;
    save(): void;
    parseTimezones(str: string): Timezone[];
    render(): JSX.Element;
}
