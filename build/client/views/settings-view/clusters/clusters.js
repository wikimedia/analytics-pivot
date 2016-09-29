"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./clusters.css');
var React = require('react');
var button_1 = require('../../../components/button/button');
var constants_1 = require("../../../config/constants");
var simple_table_1 = require('../../../components/simple-table/simple-table');
var index_1 = require('../../../components/index');
var Clusters = (function (_super) {
    __extends(Clusters, _super);
    function Clusters() {
        _super.call(this);
        this.state = {};
    }
    Clusters.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.settings)
            this.setState({
                newSettings: nextProps.settings
            });
    };
    Clusters.prototype.editCluster = function (cluster) {
        window.location.hash += "/" + cluster.name;
    };
    Clusters.prototype.startSeed = function () {
        window.location.hash += '/new-cluster';
    };
    Clusters.prototype.renderEmpty = function () {
        return React.createElement("div", {className: "clusters empty"}, 
            React.createElement("div", {className: "title"}, constants_1.STRINGS.noClusters), 
            React.createElement("div", {className: "subtitle"}, 
                "Start by ", 
                React.createElement("a", {onClick: this.startSeed.bind(this)}, "adding a new cluster")));
    };
    Clusters.prototype.removeCluster = function (cluster) {
        var _this = this;
        var remove = function () {
            var settings = _this.state.newSettings;
            var index = settings.clusters.indexOf(cluster);
            if (index < 0)
                return;
            var newClusters = settings.clusters;
            newClusters.splice(index, 1);
            _this.props.onSave(settings.changeClusters(newClusters), 'Cluster removed');
            index_1.Notifier.removeQuestion();
        };
        var cancel = function () {
            index_1.Notifier.removeQuestion();
        };
        index_1.Notifier.ask({
            title: 'Remove this cluster',
            message: [
                ("Are you sure you would like to delete the cluster \"" + cluster.title + "\"?"),
                'This action is not reversible.'
            ],
            choices: [
                { label: 'Remove', callback: remove, type: 'warn' },
                { label: 'Cancel', callback: cancel, type: 'secondary' }
            ],
            onClose: index_1.Notifier.removeQuestion
        });
    };
    Clusters.prototype.render = function () {
        var newSettings = this.state.newSettings;
        if (!newSettings)
            return null;
        if (!newSettings.clusters.length)
            return this.renderEmpty();
        var columns = [
            { label: 'Title', field: 'title', width: 200, cellIcon: 'full-cluster' },
            { label: 'Host', field: 'host', width: 200 },
            { label: 'Type', field: 'type', width: 300 }
        ];
        var actions = [
            { icon: 'full-edit', callback: this.editCluster.bind(this) },
            { icon: 'full-remove', callback: this.removeCluster.bind(this) }
        ];
        return React.createElement("div", {className: "clusters"}, 
            React.createElement("div", {className: "title-bar"}, 
                React.createElement("div", {className: "title"}, "Clusters"), 
                React.createElement(button_1.Button, {className: "add", title: constants_1.STRINGS.connectNewCluster, type: "primary", onClick: this.startSeed.bind(this)})), 
            React.createElement("div", {className: "content"}, 
                React.createElement(simple_table_1.SimpleTable, {columns: columns, rows: newSettings.clusters, actions: actions, onRowClick: this.editCluster.bind(this)})
            ));
    };
    return Clusters;
}(React.Component));
exports.Clusters = Clusters;
