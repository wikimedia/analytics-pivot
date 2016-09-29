"use strict";
var Q = require('q');
var fs = require('fs-promise');
var yaml = require('js-yaml');
var general_1 = require('../../../common/utils/general/general');
var index_1 = require('../../../common/manifests/index');
var index_2 = require('../../../common/models/index');
var yaml_helper_1 = require('../../../common/utils/yaml-helper/yaml-helper');
function readSettingsFactory(filepath, format, inline) {
    if (inline === void 0) { inline = false; }
    return function () {
        return Q(fs.readFile(filepath, 'utf-8')
            .then(function (fileData) {
            switch (format) {
                case 'json': return JSON.parse(fileData);
                case 'yaml': return yaml.safeLoad(fileData);
                default: throw new Error("unsupported format '" + format + "'");
            }
        })
            .then(function (appSettingsJS) {
            if (inline)
                appSettingsJS = general_1.inlineVars(appSettingsJS, process.env);
            return index_2.AppSettings.fromJS(appSettingsJS, { visualizations: index_1.MANIFESTS });
        }));
    };
}
function writeSettingsFactory(filepath, format) {
    return function (appSettings) {
        return Q.fcall(function () {
            switch (format) {
                case 'json': return JSON.stringify(appSettings);
                case 'yaml': return yaml_helper_1.appSettingsToYAML(appSettings, false);
                default: throw new Error("unsupported format '" + format + "'");
            }
        })
            .then(function (appSettingsYAML) {
            return fs.writeFile(filepath, appSettingsYAML);
        });
    };
}
var SettingsStore = (function () {
    function SettingsStore() {
    }
    SettingsStore.fromTransient = function (initAppSettings) {
        var settingsStore = new SettingsStore();
        settingsStore.readSettings = function () { return Q(initAppSettings); };
        return settingsStore;
    };
    SettingsStore.fromReadOnlyFile = function (filepath, format) {
        var settingsStore = new SettingsStore();
        settingsStore.readSettings = readSettingsFactory(filepath, format, true);
        return settingsStore;
    };
    SettingsStore.fromWritableFile = function (filepath, format) {
        var settingsStore = new SettingsStore();
        settingsStore.readSettings = readSettingsFactory(filepath, format);
        settingsStore.writeSettings = writeSettingsFactory(filepath, format);
        return settingsStore;
    };
    SettingsStore.fromStateStore = function (stateStore) {
        var settingsStore = new SettingsStore();
        settingsStore.readSettings = function () {
            return Q(stateStore.readState()
                .then(function (stateData) { return index_2.AppSettings.fromJS(JSON.parse(stateData), { visualizations: index_1.MANIFESTS }); }));
        };
        settingsStore.writeSettings = function (appSettings) {
            return Q.fcall(function () { return JSON.stringify(appSettings); })
                .then(function (appSettingsJSON) {
                return stateStore.writeState(appSettingsJSON);
            });
        };
        return settingsStore;
    };
    return SettingsStore;
}());
exports.SettingsStore = SettingsStore;
