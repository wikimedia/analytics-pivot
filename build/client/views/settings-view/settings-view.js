"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./settings-view.css');
var React = require('react');
var index_1 = require('../../../common/manifests/index');
var constants_1 = require('../../config/constants');
var ajax_1 = require('../../utils/ajax/ajax');
var array_1 = require('../../../common/utils/array/array');
var immutable_utils_1 = require('../../../common/utils/immutable-utils/immutable-utils');
var dom_1 = require('../../utils/dom/dom');
var notifications_1 = require('../../components/notifications/notifications');
var index_2 = require('../../components/index');
var index_3 = require('../../modals/index');
var index_4 = require('../../../common/models/index');
var settings_header_bar_1 = require('./settings-header-bar/settings-header-bar');
var general_1 = require('./general/general');
var clusters_1 = require('./clusters/clusters');
var cluster_edit_1 = require('./cluster-edit/cluster-edit');
var data_cubes_1 = require('./data-cubes/data-cubes');
var data_cube_edit_1 = require('./data-cube-edit/data-cube-edit');
var VIEWS = [
    { label: 'General', value: 'general', svg: require('../../icons/full-settings.svg') },
    { label: 'Clusters', value: 'clusters', svg: require('../../icons/full-cluster.svg') },
    { label: 'Data Cubes', value: 'data-cubes', svg: require('../../icons/full-cube.svg') }
];
var SettingsView = (function (_super) {
    __extends(SettingsView, _super);
    function SettingsView() {
        _super.call(this);
        this.state = {};
    }
    SettingsView.prototype.componentDidMount = function () {
        var _this = this;
        ajax_1.Ajax.query({ method: "GET", url: 'settings' })
            .then(function (resp) {
            _this.setState({
                settings: index_4.AppSettings.fromJS(resp.appSettings, { visualizations: index_1.MANIFESTS })
            });
        }, function (xhr) { return notifications_1.Notifier.failure('Sorry', "The settings couldn't be loaded"); }).done();
    };
    SettingsView.prototype.onSave = function (settings, okMessage) {
        var _this = this;
        var onSettingsChange = this.props.onSettingsChange;
        return ajax_1.Ajax.query({
            method: "POST",
            url: 'settings',
            data: { appSettings: settings }
        })
            .then(function (status) {
            _this.setState({ settings: settings });
            notifications_1.Notifier.success(okMessage ? okMessage : 'Settings saved');
            if (onSettingsChange) {
                onSettingsChange(settings.toClientSettings().attachExecutors(function (dataCube) {
                    return ajax_1.Ajax.queryUrlExecutorFactory(dataCube.name, 'plywood');
                }));
            }
        }, function (xhr) { return notifications_1.Notifier.failure('Woops', 'Something bad happened'); });
    };
    SettingsView.prototype.selectTab = function (value) {
        window.location.hash = "settings/" + value;
        this.setState({
            tempCluster: null,
            tempDataCube: null
        });
    };
    SettingsView.prototype.renderLeftButtons = function (breadCrumbs) {
        var _this = this;
        if (!breadCrumbs || !breadCrumbs.length)
            return [];
        return VIEWS.map(function (_a) {
            var label = _a.label, value = _a.value, svg = _a.svg;
            return React.createElement(index_2.Button, {className: dom_1.classNames({ active: breadCrumbs[0] === value }), title: label, type: "primary", svg: svg, key: value, onClick: _this.selectTab.bind(_this, value)});
        });
    };
    SettingsView.prototype.onURLChange = function (breadCrumbs) {
        this.setState({ breadCrumbs: breadCrumbs });
    };
    SettingsView.prototype.createCluster = function (newCluster) {
        this.setState({
            tempCluster: newCluster
        });
    };
    SettingsView.prototype.addCluster = function (newCluster) {
        this.onSave(immutable_utils_1.ImmutableUtils.addInArray(this.state.settings, 'clusters', newCluster), 'Cluster created').then(this.backToClustersView.bind(this));
    };
    SettingsView.prototype.backToClustersView = function () {
        window.location.hash = '#settings/clusters';
        this.setState({
            tempCluster: null
        });
    };
    SettingsView.prototype.updateCluster = function (newCluster) {
        var settings = this.state.settings;
        var index = array_1.indexByAttribute(settings.clusters, 'name', newCluster.name);
        this.onSave(immutable_utils_1.ImmutableUtils.addInArray(settings, 'clusters', newCluster, index)).then(this.backToClustersView.bind(this));
    };
    SettingsView.prototype.createDataCube = function (newDataCube) {
        this.setState({
            tempDataCube: newDataCube
        });
    };
    SettingsView.prototype.addDataCube = function (newDataCube) {
        this.onSave(immutable_utils_1.ImmutableUtils.addInArray(this.state.settings, 'dataCubes', newDataCube), 'Cube created').then(this.backToDataCubesView.bind(this));
    };
    SettingsView.prototype.backToDataCubesView = function () {
        window.location.hash = '#settings/data-cubes';
        this.setState({
            tempDataCube: null
        });
    };
    SettingsView.prototype.updateDataCube = function (newDataCube) {
        var settings = this.state.settings;
        var index = array_1.indexByAttribute(settings.dataCubes, 'name', newDataCube.name);
        this.onSave(immutable_utils_1.ImmutableUtils.addInArray(settings, 'dataCubes', newDataCube, index)).then(this.backToDataCubesView.bind(this));
    };
    SettingsView.prototype.render = function () {
        var _a = this.props, user = _a.user, onNavClick = _a.onNavClick, customization = _a.customization;
        var _b = this.state, settings = _b.settings, breadCrumbs = _b.breadCrumbs, tempCluster = _b.tempCluster, tempDataCube = _b.tempDataCube;
        if (!settings)
            return null;
        var inflateCluster = function (key, value) {
            if (key !== 'clusterId')
                return { key: key, value: value };
            return {
                key: 'cluster',
                value: settings.clusters.filter(function (d) { return d.name === value; })[0]
            };
        };
        var inflateDataCube = function (key, value) {
            if (key !== 'dataCubeId')
                return { key: key, value: value };
            return {
                key: 'dataCube',
                value: settings.dataCubes.filter(function (d) { return d.name === value; })[0]
            };
        };
        return React.createElement("div", {className: "settings-view"}, 
            React.createElement(settings_header_bar_1.SettingsHeaderBar, {user: user, onNavClick: onNavClick, customization: customization, title: constants_1.STRINGS.settings}), 
            React.createElement("div", {className: "left-panel"}, this.renderLeftButtons(breadCrumbs)), 
            React.createElement("div", {className: "main-panel"}, 
                React.createElement(index_2.Router, {rootFragment: "settings", onURLChange: this.onURLChange.bind(this)}, 
                    React.createElement(index_2.Route, {fragment: "general"}, 
                        React.createElement(general_1.General, {settings: settings, onSave: this.onSave.bind(this)})
                    ), 
                    React.createElement(index_2.Route, {fragment: "clusters"}, 
                        React.createElement(clusters_1.Clusters, {settings: settings, onSave: this.onSave.bind(this)}), 
                        React.createElement(index_2.Route, {fragment: "new-cluster"}, 
                            tempCluster ? null : React.createElement(clusters_1.Clusters, {settings: settings, onSave: this.onSave.bind(this)}), 
                            tempCluster
                                ? React.createElement(cluster_edit_1.ClusterEdit, {isNewCluster: true, cluster: tempCluster, onSave: this.addCluster.bind(this), onCancel: this.backToClustersView.bind(this)})
                                : React.createElement(index_3.ClusterSeedModal, {onNext: this.createCluster.bind(this), onCancel: this.backToClustersView.bind(this), clusters: settings.clusters})), 
                        React.createElement(index_2.Route, {fragment: ":clusterId", inflate: inflateCluster}, 
                            React.createElement(cluster_edit_1.ClusterEdit, {onSave: this.updateCluster.bind(this)})
                        )), 
                    React.createElement(index_2.Route, {fragment: "data-cubes"}, 
                        React.createElement(data_cubes_1.DataCubes, {settings: settings, onSave: this.onSave.bind(this)}), 
                        React.createElement(index_2.Route, {fragment: "new-data-cube"}, 
                            tempDataCube ? null : React.createElement(data_cubes_1.DataCubes, {settings: settings, onSave: this.onSave.bind(this)}), 
                            tempDataCube
                                ? React.createElement(data_cube_edit_1.DataCubeEdit, {clusters: settings.clusters, isNewDataCube: true, dataCube: tempDataCube, onSave: this.addDataCube.bind(this), onCancel: this.backToDataCubesView.bind(this)})
                                : React.createElement(index_3.DataCubeSeedModal, {onNext: this.createDataCube.bind(this), onCancel: this.backToDataCubesView.bind(this), dataCubes: settings.dataCubes, clusters: settings.clusters})), 
                        React.createElement(index_2.Route, {fragment: ":dataCubeId/:tab=general", inflate: inflateDataCube}, 
                            React.createElement(data_cube_edit_1.DataCubeEdit, {onSave: this.updateDataCube.bind(this), clusters: settings.clusters})
                        )))
            ));
    };
    return SettingsView;
}(React.Component));
exports.SettingsView = SettingsView;
