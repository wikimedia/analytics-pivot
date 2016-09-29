"use strict";
var Q = require('q');
var plywood_1 = require('plywood');
var general_1 = require('../../../common/utils/general/general');
var time_monitor_1 = require("../../../common/utils/time-monitor/time-monitor");
var index_1 = require('../../../common/models/index');
var file_manager_1 = require('../file-manager/file-manager');
var cluster_manager_1 = require('../cluster-manager/cluster-manager');
var updater_1 = require('../updater/updater');
var SettingsManager = (function () {
    function SettingsManager(settingsStore, options) {
        var _this = this;
        var logger = options.logger;
        this.logger = logger;
        this.verbose = Boolean(options.verbose);
        this.anchorPath = options.anchorPath;
        this.timeMonitor = new time_monitor_1.TimeMonitor(logger);
        this.settingsStore = settingsStore;
        this.fileManagers = [];
        this.clusterManagers = [];
        this.initialLoadTimeout = options.initialLoadTimeout || 30000;
        this.appSettings = index_1.AppSettings.BLANK;
        this.currentWork = settingsStore.readSettings()
            .then(function (appSettings) {
            return _this.reviseSettings(appSettings);
        })
            .catch(function (e) {
            logger.error("Fatal settings load error: " + e.message);
            logger.error(e.stack);
            throw e;
        });
    }
    SettingsManager.prototype.isStateful = function () {
        return Boolean(this.settingsStore.writeSettings);
    };
    SettingsManager.prototype.getClusterManagerFor = function (clusterName) {
        return plywood_1.find(this.clusterManagers, function (clusterManager) { return clusterManager.cluster.name === clusterName; });
    };
    SettingsManager.prototype.addClusterManager = function (cluster, dataCubes) {
        var _a = this, verbose = _a.verbose, logger = _a.logger, anchorPath = _a.anchorPath;
        var initialExternals = dataCubes.map(function (dataCube) {
            return {
                name: dataCube.name,
                external: dataCube.toExternal(),
                suppressIntrospection: dataCube.getIntrospection() === 'none'
            };
        });
        logger.log("Adding cluster manager for '" + cluster.name + "' with " + general_1.pluralIfNeeded(dataCubes.length, 'dataCube'));
        var clusterManager = new cluster_manager_1.ClusterManager(cluster, {
            logger: logger,
            verbose: verbose,
            anchorPath: anchorPath,
            initialExternals: initialExternals,
            onExternalChange: this.onExternalChange.bind(this, cluster),
            generateExternalName: this.generateDataCubeName.bind(this)
        });
        this.clusterManagers.push(clusterManager);
        return clusterManager.init();
    };
    SettingsManager.prototype.removeClusterManager = function (cluster) {
        this.clusterManagers = this.clusterManagers.filter(function (clusterManager) {
            if (clusterManager.cluster.name !== cluster.name)
                return true;
            clusterManager.destroy();
            return false;
        });
    };
    SettingsManager.prototype.getFileManagerFor = function (uri) {
        return plywood_1.find(this.fileManagers, function (fileManager) { return fileManager.uri === uri; });
    };
    SettingsManager.prototype.addFileManager = function (dataCube) {
        if (dataCube.clusterName !== 'native')
            throw new Error("data cube '" + dataCube.name + "' must be native to have a file manager");
        var _a = this, verbose = _a.verbose, logger = _a.logger, anchorPath = _a.anchorPath;
        var fileManager = new file_manager_1.FileManager({
            logger: logger,
            verbose: verbose,
            anchorPath: anchorPath,
            uri: dataCube.source,
            subsetExpression: dataCube.subsetExpression,
            onDatasetChange: this.onDatasetChange.bind(this, dataCube.name)
        });
        this.fileManagers.push(fileManager);
        return fileManager.init();
    };
    SettingsManager.prototype.removeFileManager = function (dataCube) {
        if (dataCube.clusterName !== 'native')
            throw new Error("data cube '" + dataCube.name + "' must be native to have a file manager");
        this.fileManagers = this.fileManagers.filter(function (fileManager) {
            if (fileManager.uri !== dataCube.source)
                return true;
            fileManager.destroy();
            return false;
        });
    };
    SettingsManager.prototype.getTimekeeper = function () {
        return this.timeMonitor.timekeeper;
    };
    SettingsManager.prototype.getSettings = function (opts) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        var currentWork = this.currentWork;
        var currentWork = currentWork.then(function () {
            return Q.all(_this.clusterManagers.map(function (clusterManager) { return clusterManager.refresh(); }));
        });
        var timeout = opts.timeout || this.initialLoadTimeout;
        if (timeout !== 0) {
            currentWork = currentWork.timeout(timeout)
                .catch(function (e) {
                _this.logger.error("Settings load timeout hit, continuing");
            });
        }
        return currentWork.then(function () { return _this.appSettings; });
    };
    SettingsManager.prototype.reviseSettings = function (newSettings) {
        var tasks = [
            this.reviseClusters(newSettings),
            this.reviseDataCubes(newSettings)
        ];
        this.appSettings = newSettings;
        return Q.all(tasks);
    };
    SettingsManager.prototype.reviseClusters = function (newSettings) {
        var _this = this;
        var _a = this, verbose = _a.verbose, logger = _a.logger;
        var oldSettings = this.appSettings;
        var tasks = [];
        updater_1.updater(oldSettings.clusters, newSettings.clusters, {
            onExit: function (oldCluster) {
                _this.removeClusterManager(oldCluster);
            },
            onUpdate: function (newCluster) {
                logger.log(newCluster.name + " UPDATED cluster");
            },
            onEnter: function (newCluster) {
                tasks.push(_this.addClusterManager(newCluster, newSettings.getDataCubesForCluster(newCluster.name)));
            }
        });
        return Q.all(tasks);
    };
    SettingsManager.prototype.reviseDataCubes = function (newSettings) {
        var _this = this;
        var _a = this, verbose = _a.verbose, logger = _a.logger;
        var oldSettings = this.appSettings;
        var tasks = [];
        var oldNativeDataCubes = oldSettings.getDataCubesForCluster('native');
        var newNativeDataCubes = newSettings.getDataCubesForCluster('native');
        updater_1.updater(oldNativeDataCubes, newNativeDataCubes, {
            onExit: function (oldDataCube) {
                if (oldDataCube.clusterName === 'native') {
                    _this.removeFileManager(oldDataCube);
                }
                else {
                    throw new Error("only native data cubes work for now");
                }
            },
            onUpdate: function (newDataCube) {
                logger.log(newDataCube.name + " UPDATED datasource");
            },
            onEnter: function (newDataCube) {
                if (newDataCube.clusterName === 'native') {
                    tasks.push(_this.addFileManager(newDataCube));
                }
                else {
                    throw new Error("only native data cube work for now");
                }
            }
        });
        return Q.all(tasks);
    };
    SettingsManager.prototype.updateSettings = function (newSettings) {
        var _this = this;
        if (!this.settingsStore.writeSettings)
            return Q.reject(new Error('must be writable'));
        var loadedNewSettings = newSettings.attachExecutors(function (dataCube) {
            if (dataCube.clusterName === 'native') {
                var fileManager = _this.getFileManagerFor(dataCube.source);
                if (fileManager) {
                    var dataset = fileManager.dataset;
                    if (!dataset)
                        return null;
                    return plywood_1.basicExecutorFactory({
                        datasets: { main: dataset }
                    });
                }
            }
            else {
                var clusterManager = _this.getClusterManagerFor(dataCube.clusterName);
                if (clusterManager) {
                    var external = clusterManager.getExternalByName(dataCube.name);
                    if (!external)
                        return null;
                    return plywood_1.basicExecutorFactory({
                        datasets: { main: external }
                    });
                }
            }
            return null;
        });
        return this.settingsStore.writeSettings(loadedNewSettings)
            .then(function () {
            _this.appSettings = loadedNewSettings;
        });
    };
    SettingsManager.prototype.generateDataCubeName = function (external) {
        var appSettings = this.appSettings;
        var source = String(external.source);
        var candidateName = source;
        var i = 0;
        while (appSettings.getDataCube(candidateName)) {
            i++;
            candidateName = source + i;
        }
        return candidateName;
    };
    SettingsManager.prototype.onDatasetChange = function (dataCubeName, changedDataset) {
        var _a = this, logger = _a.logger, verbose = _a.verbose;
        logger.log("Got native dataset update for " + dataCubeName);
        var dataCube = this.appSettings.getDataCube(dataCubeName);
        if (!dataCube)
            throw new Error("Unknown dataset " + dataCubeName);
        dataCube = dataCube.updateWithDataset(changedDataset);
        if (dataCube.refreshRule.isQuery()) {
            this.timeMonitor.addCheck(dataCube.name, function () {
                return index_1.DataCube.queryMaxTime(dataCube);
            });
        }
        this.appSettings = this.appSettings.addOrUpdateDataCube(dataCube);
    };
    SettingsManager.prototype.onExternalChange = function (cluster, dataCubeName, changedExternal) {
        if (!changedExternal.attributes || !changedExternal.requester)
            return Q(null);
        var _a = this, logger = _a.logger, verbose = _a.verbose;
        logger.log("Got queryable external dataset update for " + dataCubeName + " in cluster " + cluster.name);
        var dataCube = this.appSettings.getDataCube(dataCubeName);
        if (!dataCube) {
            dataCube = index_1.DataCube.fromClusterAndExternal(dataCubeName, cluster, changedExternal);
        }
        dataCube = dataCube.updateWithExternal(changedExternal);
        if (dataCube.refreshRule.isQuery()) {
            this.timeMonitor.addCheck(dataCube.name, function () {
                return index_1.DataCube.queryMaxTime(dataCube);
            });
        }
        this.appSettings = this.appSettings.addOrUpdateDataCube(dataCube);
        return Q(null);
    };
    return SettingsManager;
}());
exports.SettingsManager = SettingsManager;
