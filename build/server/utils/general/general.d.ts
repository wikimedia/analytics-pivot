/// <reference types="q" />
import * as Q from 'q';
import { Request } from 'express';
import { User, AppSettings } from '../../../common/models/index';
import { GetSettingsOptions } from '../settings-manager/settings-manager';
export interface PivotRequest extends Request {
    version: string;
    stateful: boolean;
    user: User;
    getSettings(opts?: GetSettingsOptions): Q.Promise<AppSettings>;
}
