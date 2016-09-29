import { List } from 'immutable';
import { BaseImmutable, Property } from 'immutable-class';
import { Expression, Datum, ApplyAction, AttributeInfo } from 'plywood';
export interface MeasureValue {
    name: string;
    title?: string;
    units?: string;
    formula?: string;
    format?: string;
}
export interface MeasureJS {
    name: string;
    title?: string;
    units?: string;
    formula?: string;
    format?: string;
}
export declare class Measure extends BaseImmutable<MeasureValue, MeasureJS> {
    static DEFAULT_FORMAT: string;
    static INTEGER_FORMAT: string;
    static isMeasure(candidate: any): candidate is Measure;
    static getMeasure(measures: List<Measure>, measureName: string): Measure;
    static getAggregateReferences(ex: Expression): string[];
    static getCountDistinctReferences(ex: Expression): string[];
    static measuresFromAttributeInfo(attribute: AttributeInfo): Measure[];
    static fromJS(parameters: MeasureJS): Measure;
    static PROPERTIES: Property[];
    name: string;
    title: string;
    units: string;
    formula: string;
    expression: Expression;
    format: string;
    formatFn: (n: number) => string;
    constructor(parameters: MeasureValue);
    toApplyAction(): ApplyAction;
    formatDatum(datum: Datum): string;
    getTitle: () => string;
    changeTitle: (newTitle: string) => this;
    getTitleWithUnits(): string;
    getFormula: () => string;
    changeFormula: (newFormula: string) => this;
    getFormat: () => string;
    changeFormat: (newFormat: string) => this;
}
