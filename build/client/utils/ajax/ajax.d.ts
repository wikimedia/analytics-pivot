/// <reference types="q" />
import * as Q from 'q';
import { Executor } from 'plywood';
export interface AjaxOptions {
    method: 'GET' | 'POST';
    url: string;
    data?: any;
}
export declare class Ajax {
    static version: string;
    static settingsVersionGetter: () => number;
    static onUpdate: () => void;
    static query(options: AjaxOptions): Q.Promise<any>;
    static queryUrlExecutorFactory(name: string, url: string): Executor;
}
