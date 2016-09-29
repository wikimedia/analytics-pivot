import * as React from 'react';
import { Measure } from '../../../common/models/index';
import { ImmutableFormState } from '../../utils/immutable-form-delegate/immutable-form-delegate';
export interface MeasureModalProps extends React.Props<any> {
    measure?: Measure;
    onSave?: (measure: Measure) => void;
    onClose?: () => void;
}
export declare class MeasureModal extends React.Component<MeasureModalProps, ImmutableFormState<Measure>> {
    private hasInitialized;
    private delegate;
    constructor();
    initStateFromProps(props: MeasureModalProps): void;
    componentWillReceiveProps(nextProps: MeasureModalProps): void;
    componentDidMount(): void;
    save(): void;
    render(): JSX.Element;
}
