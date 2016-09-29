"use strict";
require('./pivot-entry.css');
var React = require('react');
var ReactDOM = require('react-dom');
var error_monitor_1 = require('./utils/error-monitor/error-monitor');
var loader_1 = require('./components/loader/loader');
error_monitor_1.addErrorMonitor();
var container = document.getElementsByClassName('app-container')[0];
if (!container)
    throw new Error('container not found');
ReactDOM.render(React.createElement(loader_1.Loader), container);
var config = window['__CONFIG__'];
if (!config || !config.version || !config.appSettings || !config.appSettings.dataCubes) {
    throw new Error('config not found');
}
var version = config.version;
require.ensure([
    'chronoshift',
    'chronoshift/lib/walltime/walltime-data.js',
    './utils/ajax/ajax',
    '../common/models/index',
    '../common/manifests/index',
    './applications/pivot-application/pivot-application'
], function (require) {
    var WallTime = require('chronoshift').WallTime;
    var Ajax = require('./utils/ajax/ajax').Ajax;
    var _a = require('../common/models/index'), AppSettings = _a.AppSettings, Timekeeper = _a.Timekeeper;
    var MANIFESTS = require('../common/manifests/index').MANIFESTS;
    var PivotApplication = require('./applications/pivot-application/pivot-application').PivotApplication;
    Ajax.version = version;
    var appSettings = AppSettings.fromJS(config.appSettings, {
        visualizations: MANIFESTS,
        executorFactory: function (dataCube) {
            return Ajax.queryUrlExecutorFactory(dataCube.name, 'plywood');
        }
    });
    if (!WallTime.rules) {
        var tzData = require('chronoshift/lib/walltime/walltime-data.js');
        WallTime.init(tzData.rules, tzData.zones);
    }
    ReactDOM.render(React.createElement(PivotApplication, {
        version: version,
        user: config.user,
        appSettings: appSettings,
        initTimekeeper: Timekeeper.fromJS(config.timekeeper),
        stateful: Boolean(config.stateful)
    }), container);
}, 'pivot-main');
var div = document.createElement('div');
var dragDiv = 'draggable' in div;
var evts = 'ondragstart' in div && 'ondrop' in div;
var needsPatch = !(dragDiv || evts) || /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
if (needsPatch) {
    require.ensure([
        '../../lib/polyfill/drag-drop-polyfill.min.js',
        '../../lib/polyfill/drag-drop-polyfill.css'
    ], function (require) {
        var DragDropPolyfill = require('../../lib/polyfill/drag-drop-polyfill.min.js');
        require('../../lib/polyfill/drag-drop-polyfill.css');
        DragDropPolyfill.Initialize({});
    }, 'ios-drag-drop');
}
