import { Splits, DataCube, Colors } from '../../models/index';
import { Resolve } from '../../models/manifest/manifest';
export declare type Configuration = (splits: Splits, dataCube?: DataCube) => boolean;
export declare type Action = (splits?: Splits, dataCube?: DataCube, colors?: Colors, current?: boolean) => Resolve;
export declare class CircumstancesHandler {
    static noSplits(): (splits: Splits) => boolean;
    private static testKind(kind, selector);
    static strictCompare(selectors: string[], kinds: string[]): boolean;
    static areExactSplitKinds: (...selectors: string[]) => (splits: Splits, dataCube: DataCube) => boolean;
    static haveAtLeastSplitKinds: (...kinds: string[]) => (splits: Splits, dataCube: DataCube) => boolean;
    static EMPTY(): CircumstancesHandler;
    private configurations;
    private actions;
    private otherwiseAction;
    constructor();
    when(configuration: Configuration): any;
    otherwise(action: Action): CircumstancesHandler;
    needsAtLeastOneSplit(message?: string): CircumstancesHandler;
    evaluate(dataCube: DataCube, splits: Splits, colors: Colors, current: boolean): Resolve;
}
