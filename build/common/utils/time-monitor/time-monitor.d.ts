/// <reference types="q" />
import * as Q from "q";
import { Logger } from 'logger-tracker';
import { Timekeeper } from "../../models/timekeeper/timekeeper";
export interface Check {
    (): Q.Promise<Date>;
}
export declare class TimeMonitor {
    logger: Logger;
    regularCheckInterval: number;
    specialCheckInterval: number;
    timekeeper: Timekeeper;
    checks: Lookup<Check>;
    private doingChecks;
    constructor(logger: Logger);
    addCheck(name: string, check: Check): this;
    removeCheck(name: string): this;
    private doCheck(name);
    private doChecks();
}
