/// <reference types="q" />
import * as Q from 'q';
import { Dataset, Expression } from 'plywood';
import { Logger } from 'logger-tracker';
export declare function getFileData(filePath: string): Q.Promise<any[]>;
export interface FileManagerOptions {
    logger: Logger;
    verbose?: boolean;
    anchorPath: string;
    uri: string;
    subsetExpression?: Expression;
    onDatasetChange?: (dataset: Dataset) => void;
}
export declare class FileManager {
    logger: Logger;
    verbose: boolean;
    anchorPath: string;
    uri: string;
    dataset: Dataset;
    subsetExpression: Expression;
    onDatasetChange: (dataset: Dataset) => void;
    constructor(options: FileManagerOptions);
    init(): Q.Promise<any>;
    destroy(): void;
}
