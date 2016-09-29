"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var immutable_class_1 = require('immutable-class');
var SettingsLocation = (function (_super) {
    __extends(SettingsLocation, _super);
    function SettingsLocation(parameters) {
        _super.call(this, parameters);
        if (this.location === 'file' && this.table)
            this.table = null;
    }
    SettingsLocation.isSettingsLocation = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, SettingsLocation);
    };
    SettingsLocation.fromJS = function (parameters) {
        return new SettingsLocation(immutable_class_1.BaseImmutable.jsToValue(SettingsLocation.PROPERTIES, parameters));
    };
    SettingsLocation.prototype.getFormat = function () {
        if (this.format)
            return this.format;
        if (this.location === 'file') {
            if (/\.json$/.test(this.uri)) {
                return 'json';
            }
            else if (/\.yaml$/.test(this.uri)) {
                return 'yaml';
            }
        }
        return SettingsLocation.DEFAULT_FORMAT;
    };
    SettingsLocation.LOCATION_VALUES = ['file', 'mysql', 'postgres'];
    SettingsLocation.DEFAULT_FORMAT = 'json';
    SettingsLocation.FORMAT_VALUES = ['json', 'yaml'];
    SettingsLocation.PROPERTIES = [
        { name: 'location', possibleValues: SettingsLocation.LOCATION_VALUES },
        { name: 'uri' },
        { name: 'table', defaultValue: null },
        { name: 'format', defaultValue: SettingsLocation.DEFAULT_FORMAT, possibleValues: SettingsLocation.FORMAT_VALUES },
        { name: 'readOnly', defaultValue: false }
    ];
    return SettingsLocation;
}(immutable_class_1.BaseImmutable));
exports.SettingsLocation = SettingsLocation;
immutable_class_1.BaseImmutable.finalize(SettingsLocation);
