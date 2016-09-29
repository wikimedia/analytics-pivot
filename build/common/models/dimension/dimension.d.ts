import { List } from 'immutable';
import { Instance } from 'immutable-class';
import { Expression } from 'plywood';
import { Granularity, GranularityJS } from "../granularity/granularity";
export declare type BucketingStrategy = 'defaultBucket' | 'defaultNoBucket';
export interface DimensionValue {
    name: string;
    title?: string;
    formula?: string;
    kind?: string;
    url?: string;
    granularities?: Granularity[];
    bucketedBy?: Granularity;
    bucketingStrategy?: BucketingStrategy;
    sortStrategy?: string;
}
export interface DimensionJS {
    name: string;
    title?: string;
    formula?: string;
    kind?: string;
    url?: string;
    granularities?: GranularityJS[];
    bucketedBy?: GranularityJS;
    bucketingStrategy?: BucketingStrategy;
    sortStrategy?: string;
}
export declare class Dimension implements Instance<DimensionValue, DimensionJS> {
    static defaultBucket: BucketingStrategy;
    static defaultNoBucket: BucketingStrategy;
    static isDimension(candidate: any): candidate is Dimension;
    static getDimension(dimensions: List<Dimension>, dimensionName: string): Dimension;
    static getDimensionByExpression(dimensions: List<Dimension>, expression: Expression): Dimension;
    static fromJS(parameters: DimensionJS): Dimension;
    name: string;
    title: string;
    formula: string;
    expression: Expression;
    kind: string;
    className: string;
    url: string;
    granularities: Granularity[];
    bucketedBy: Granularity;
    bucketingStrategy: BucketingStrategy;
    sortStrategy: string;
    constructor(parameters: DimensionValue);
    valueOf(): DimensionValue;
    toJS(): DimensionJS;
    toJSON(): DimensionJS;
    toString(): string;
    equals(other: Dimension): boolean;
    canBucketByDefault(): boolean;
    isContinuous(): boolean;
    change(propertyName: string, newValue: any): Dimension;
    changeKind(newKind: string): Dimension;
    changeName(newName: string): Dimension;
    changeTitle(newTitle: string): Dimension;
    changeFormula(newFormula: string): Dimension;
}
