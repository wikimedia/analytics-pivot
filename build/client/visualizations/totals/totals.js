"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./totals.css');
var React = require('react');
var plywood_1 = require('plywood');
var totals_1 = require('../../../common/manifests/totals/totals');
var base_visualization_1 = require('../base-visualization/base-visualization');
var PADDING_H = 60;
var TOTAL_WIDTH = 176;
var Totals = (function (_super) {
    __extends(Totals, _super);
    function Totals() {
        _super.call(this);
    }
    Totals.prototype.componentWillMount = function () {
        this.precalculate(this.props);
    };
    Totals.prototype.componentDidMount = function () {
        this._isMounted = true;
        var _a = this.props, essence = _a.essence, timekeeper = _a.timekeeper;
        this.fetchData(essence, timekeeper);
    };
    Totals.prototype.componentWillReceiveProps = function (nextProps) {
        this.precalculate(nextProps);
        var _a = this.props, essence = _a.essence, timekeeper = _a.timekeeper;
        var nextEssence = nextProps.essence;
        var nextTimekeeper = nextProps.timekeeper;
        if (nextEssence.differentDataCube(essence) ||
            nextEssence.differentEffectiveFilter(essence, timekeeper, nextTimekeeper, Totals.id) ||
            nextEssence.newEffectiveMeasures(essence)) {
            this.fetchData(nextEssence, nextTimekeeper);
        }
    };
    Totals.prototype.componentWillUnmount = function () {
        this._isMounted = false;
    };
    Totals.prototype.makeQuery = function (essence, timekeeper) {
        var query = plywood_1.ply()
            .apply('main', plywood_1.$('main').filter(essence.getEffectiveFilter(timekeeper, Totals.id).toExpression()));
        essence.getEffectiveMeasures().forEach(function (measure) {
            query = query.performAction(measure.toApplyAction());
        });
        return query;
    };
    Totals.prototype.precalculate = function (props, datasetLoad) {
        if (datasetLoad === void 0) { datasetLoad = null; }
        var registerDownloadableDataset = props.registerDownloadableDataset, essence = props.essence;
        var splits = essence.splits;
        var existingDatasetLoad = this.state.datasetLoad;
        var newState = {};
        if (datasetLoad) {
            if (datasetLoad.loading)
                datasetLoad.dataset = existingDatasetLoad.dataset;
            newState.datasetLoad = datasetLoad;
        }
        else {
            datasetLoad = existingDatasetLoad;
        }
        var dataset = datasetLoad.dataset;
        if (dataset && splits.length()) {
            if (registerDownloadableDataset)
                registerDownloadableDataset(dataset);
        }
        this.setState(newState);
    };
    Totals.prototype.renderInternals = function () {
        var _a = this.props, essence = _a.essence, stage = _a.stage;
        var datasetLoad = this.state.datasetLoad;
        var myDatum = datasetLoad.dataset ? datasetLoad.dataset.data[0] : null;
        var measures = essence.getEffectiveMeasures();
        var single = measures.size === 1;
        var totals = measures.map(function (measure) {
            var measureValueStr = '-';
            if (myDatum) {
                measureValueStr = measure.formatDatum(myDatum);
            }
            return React.createElement("div", {className: 'total' + (single ? ' single' : ''), key: measure.name}, 
                React.createElement("div", {className: "measure-name"}, measure.title), 
                React.createElement("div", {className: "measure-value"}, measureValueStr));
        });
        var totalContainerStyle = null;
        if (!single) {
            var numColumns = Math.min(totals.size, Math.max(1, Math.floor((stage.width - 2 * PADDING_H) / TOTAL_WIDTH)));
            var containerWidth = numColumns * TOTAL_WIDTH;
            totalContainerStyle = {
                left: '50%',
                width: containerWidth,
                marginLeft: -containerWidth / 2
            };
        }
        return React.createElement("div", {className: "internals"}, 
            React.createElement("div", {className: "total-container", style: totalContainerStyle}, totals)
        );
    };
    Totals.id = totals_1.TOTALS_MANIFEST.name;
    return Totals;
}(base_visualization_1.BaseVisualization));
exports.Totals = Totals;
