"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./line-chart.css');
var immutable_class_1 = require('immutable-class');
var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');
var plywood_1 = require('plywood');
var index_1 = require('../../../common/models/index');
var line_chart_1 = require('../../../common/manifests/line-chart/line-chart');
var time_1 = require('../../../common/utils/time/time');
var formatter_1 = require('../../../common/utils/formatter/formatter');
var granularity_1 = require('../../../common/models/granularity/granularity');
var constants_1 = require('../../config/constants');
var dom_1 = require('../../utils/dom/dom');
var index_2 = require('../../components/index');
var base_visualization_1 = require('../base-visualization/base-visualization');
var TEXT_SPACER = 36;
var X_AXIS_HEIGHT = 30;
var Y_AXIS_WIDTH = 60;
var MIN_CHART_HEIGHT = 140;
var HOVER_BUBBLE_V_OFFSET = -7;
var HOVER_MULTI_BUBBLE_V_OFFSET = -8;
var MAX_HOVER_DIST = 50;
var MAX_ASPECT_RATIO = 1;
function findClosest(data, dragDate, scaleX, continuousDimension) {
    var closestDatum = null;
    var minDist = Infinity;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var datum = data_1[_i];
        var continuousSegmentValue = datum[continuousDimension.name];
        if (!continuousSegmentValue || !plywood_1.Range.isRange(continuousSegmentValue))
            continue;
        var mid = continuousSegmentValue.midpoint();
        var dist = Math.abs(mid.valueOf() - dragDate.valueOf());
        var distPx = Math.abs(scaleX(mid) - scaleX(dragDate));
        if ((!closestDatum || dist < minDist) && distPx < MAX_HOVER_DIST) {
            closestDatum = datum;
            minDist = dist;
        }
    }
    return closestDatum;
}
function roundTo(v, roundTo) {
    return Math.round(Math.floor(v / roundTo)) * roundTo;
}
var LineChart = (function (_super) {
    __extends(LineChart, _super);
    function LineChart() {
        _super.call(this);
    }
    LineChart.prototype.getDefaultState = function () {
        var s = _super.prototype.getDefaultState.call(this);
        s.dragStartValue = null;
        s.dragRange = null;
        s.hoverRange = null;
        return s;
    };
    LineChart.prototype.componentDidUpdate = function () {
        var _a = this.state, containerYPosition = _a.containerYPosition, containerXPosition = _a.containerXPosition;
        var node = ReactDOM.findDOMNode(this.refs['container']);
        if (!node)
            return;
        var rect = node.getBoundingClientRect();
        if (containerYPosition !== rect.top || containerXPosition !== rect.left) {
            this.setState({
                containerYPosition: rect.top,
                containerXPosition: rect.left
            });
        }
    };
    LineChart.prototype.getMyEventX = function (e) {
        var myDOM = ReactDOM.findDOMNode(this);
        var rect = myDOM.getBoundingClientRect();
        return dom_1.getXFromEvent(e) - (rect.left + constants_1.VIS_H_PADDING);
    };
    LineChart.prototype.onMouseDown = function (measure, e) {
        var clicker = this.props.clicker;
        var scaleX = this.state.scaleX;
        if (!scaleX || !clicker.dropHighlight || !clicker.changeHighlight)
            return;
        var dragStartValue = scaleX.invert(this.getMyEventX(e));
        this.setState({
            dragStartValue: dragStartValue,
            dragRange: null,
            dragOnMeasure: measure
        });
    };
    LineChart.prototype.onMouseMove = function (dataset, measure, scaleX, e) {
        var essence = this.props.essence;
        var _a = this.state, continuousDimension = _a.continuousDimension, hoverRange = _a.hoverRange, hoverMeasure = _a.hoverMeasure;
        if (!dataset)
            return;
        var splitLength = essence.splits.length();
        var myDOM = ReactDOM.findDOMNode(this);
        var rect = myDOM.getBoundingClientRect();
        var dragDate = scaleX.invert(dom_1.getXFromEvent(e) - (rect.left + constants_1.VIS_H_PADDING));
        var closestDatum;
        if (splitLength > 1) {
            var flatData = dataset.flatten();
            closestDatum = findClosest(flatData, dragDate, scaleX, continuousDimension);
        }
        else {
            closestDatum = findClosest(dataset.data, dragDate, scaleX, continuousDimension);
        }
        var currentHoverRange = closestDatum ? (closestDatum[continuousDimension.name]) : null;
        if (!hoverRange || !immutable_class_1.immutableEqual(hoverRange, currentHoverRange) || measure !== hoverMeasure) {
            this.setState({
                hoverRange: currentHoverRange,
                hoverMeasure: measure
            });
        }
    };
    LineChart.prototype.getDragRange = function (e) {
        var _a = this.state, dragStartValue = _a.dragStartValue, axisRange = _a.axisRange, scaleX = _a.scaleX;
        var dragEndValue = scaleX.invert(this.getMyEventX(e));
        var rangeJS = null;
        if (dragStartValue.valueOf() === dragEndValue.valueOf()) {
            dragEndValue = plywood_1.TimeRange.isTimeRange(axisRange) ? new Date(dragEndValue.valueOf() + 1) : dragEndValue + 1;
        }
        if (dragStartValue < dragEndValue) {
            rangeJS = { start: dragStartValue, end: dragEndValue };
        }
        else {
            rangeJS = { start: dragEndValue, end: dragStartValue };
        }
        return plywood_1.Range.fromJS(rangeJS).intersect(axisRange);
    };
    LineChart.prototype.floorRange = function (dragRange) {
        var essence = this.props.essence;
        var splits = essence.splits, timezone = essence.timezone;
        var continuousSplit = splits.last();
        if (!continuousSplit.bucketAction)
            return dragRange;
        if (plywood_1.TimeRange.isTimeRange(dragRange)) {
            var timeBucketAction = continuousSplit.bucketAction;
            var duration = timeBucketAction.duration;
            return plywood_1.TimeRange.fromJS({
                start: duration.floor(dragRange.start, timezone),
                end: duration.shift(duration.floor(dragRange.end, timezone), timezone, 1)
            });
        }
        else {
            var numberBucketAction = continuousSplit.bucketAction;
            var bucketSize = numberBucketAction.size;
            var startFloored = roundTo(dragRange.start, bucketSize);
            var endFloored = roundTo(dragRange.end, bucketSize);
            if (endFloored - startFloored < bucketSize) {
                endFloored += bucketSize;
            }
            return plywood_1.NumberRange.fromJS({
                start: startFloored,
                end: endFloored
            });
        }
    };
    LineChart.prototype.globalMouseMoveListener = function (e) {
        var dragStartValue = this.state.dragStartValue;
        if (dragStartValue === null)
            return;
        var dragRange = this.getDragRange(e);
        this.setState({
            dragRange: dragRange,
            roundDragRange: this.floorRange(dragRange)
        });
    };
    LineChart.prototype.globalMouseUpListener = function (e) {
        var _a = this.props, clicker = _a.clicker, essence = _a.essence;
        var _b = this.state, continuousDimension = _b.continuousDimension, dragStartValue = _b.dragStartValue, dragRange = _b.dragRange, dragOnMeasure = _b.dragOnMeasure;
        if (dragStartValue === null)
            return;
        var highlightRange = this.floorRange(this.getDragRange(e));
        this.resetDrag();
        if (!dragRange && essence.highlightOn(LineChart.id)) {
            var existingHighlightRange = essence.getSingleHighlightSet().elements[0];
            if (existingHighlightRange.contains(highlightRange.start)) {
                var highlight = essence.highlight;
                if (highlight.measure === dragOnMeasure.name) {
                    clicker.dropHighlight();
                }
                else {
                    clicker.changeHighlight(LineChart.id, dragOnMeasure.name, highlight.delta);
                }
                return;
            }
        }
        clicker.changeHighlight(LineChart.id, dragOnMeasure.name, index_1.Filter.fromClause(new index_1.FilterClause({
            expression: continuousDimension.expression,
            selection: plywood_1.r(highlightRange)
        })));
    };
    LineChart.prototype.globalKeyDownListener = function (e) {
        if (!dom_1.escapeKey(e))
            return;
        var dragStartValue = this.state.dragStartValue;
        if (dragStartValue === null)
            return;
        this.resetDrag();
    };
    LineChart.prototype.resetDrag = function () {
        this.setState({
            dragStartValue: null,
            dragRange: null,
            roundDragRange: null,
            dragOnMeasure: null
        });
    };
    LineChart.prototype.onMouseLeave = function (measure, e) {
        var hoverMeasure = this.state.hoverMeasure;
        if (hoverMeasure === measure) {
            this.setState({
                hoverRange: null,
                hoverMeasure: null
            });
        }
    };
    LineChart.prototype.renderHighlighter = function () {
        var essence = this.props.essence;
        var _a = this.state, dragRange = _a.dragRange, scaleX = _a.scaleX;
        if (dragRange !== null) {
            return React.createElement(index_2.Highlighter, {highlightRange: dragRange, scaleX: scaleX});
        }
        if (essence.highlightOn(LineChart.id)) {
            var highlightRange = essence.getSingleHighlightSet().elements[0];
            return React.createElement(index_2.Highlighter, {highlightRange: highlightRange, scaleX: scaleX});
        }
        return null;
    };
    LineChart.prototype.renderChartBubble = function (dataset, measure, chartIndex, containerStage, chartStage, extentY, scaleY) {
        var _a = this.props, clicker = _a.clicker, essence = _a.essence, openRawDataModal = _a.openRawDataModal;
        var colors = essence.colors, timezone = essence.timezone;
        var _b = this.state, containerYPosition = _b.containerYPosition, containerXPosition = _b.containerXPosition, scrollTop = _b.scrollTop, dragRange = _b.dragRange, roundDragRange = _b.roundDragRange;
        var _c = this.state, dragOnMeasure = _c.dragOnMeasure, hoverRange = _c.hoverRange, hoverMeasure = _c.hoverMeasure, scaleX = _c.scaleX, continuousDimension = _c.continuousDimension;
        if (essence.highlightOnDifferentMeasure(LineChart.id, measure.name))
            return null;
        var topOffset = chartStage.height * chartIndex + scaleY(extentY[1]) + TEXT_SPACER - scrollTop;
        if (topOffset < 0)
            return null;
        topOffset += containerYPosition;
        if ((dragRange && dragOnMeasure === measure) || (!dragRange && essence.highlightOn(LineChart.id, measure.name))) {
            var bubbleRange = dragRange || essence.getSingleHighlightSet().elements[0];
            var shownRange = roundDragRange || bubbleRange;
            var segmentLabel = formatter_1.formatValue(bubbleRange, timezone, time_1.DisplayYear.NEVER);
            if (colors) {
                var categoryDimension = essence.splits.get(0).getDimension(essence.dataCube.dimensions);
                var leftOffset = containerXPosition + constants_1.VIS_H_PADDING + scaleX(bubbleRange.end);
                var hoverDatums = dataset.data.map(function (d) { return d[constants_1.SPLIT].findDatumByAttribute(continuousDimension.name, bubbleRange); });
                var colorValues = colors.getColors(dataset.data.map(function (d) { return d[categoryDimension.name]; }));
                var colorEntries = dataset.data.map(function (d, i) {
                    var segment = d[categoryDimension.name];
                    var hoverDatum = hoverDatums[i];
                    if (!hoverDatum)
                        return null;
                    return {
                        color: colorValues[i],
                        segmentLabel: String(segment),
                        measureLabel: measure.formatDatum(hoverDatum)
                    };
                }).filter(Boolean);
                return React.createElement(index_2.HoverMultiBubble, {left: leftOffset, top: topOffset + HOVER_MULTI_BUBBLE_V_OFFSET, segmentLabel: segmentLabel, colorEntries: colorEntries, clicker: dragRange ? null : clicker});
            }
            else {
                var leftOffset = containerXPosition + constants_1.VIS_H_PADDING + scaleX(bubbleRange.midpoint());
                var highlightDatum = dataset.findDatumByAttribute(continuousDimension.name, shownRange);
                var segmentLabel = formatter_1.formatValue(shownRange, timezone, time_1.DisplayYear.NEVER);
                return React.createElement(index_2.SegmentBubble, {left: leftOffset, top: topOffset + HOVER_BUBBLE_V_OFFSET, segmentLabel: segmentLabel, measureLabel: highlightDatum ? measure.formatDatum(highlightDatum) : null, clicker: dragRange ? null : clicker, openRawDataModal: openRawDataModal});
            }
        }
        else if (!dragRange && hoverRange && hoverMeasure === measure) {
            var leftOffset = containerXPosition + constants_1.VIS_H_PADDING + scaleX(hoverRange.midpoint());
            var segmentLabel = formatter_1.formatValue(hoverRange, timezone, time_1.DisplayYear.NEVER);
            if (colors) {
                var categoryDimension = essence.splits.get(0).getDimension(essence.dataCube.dimensions);
                var hoverDatums = dataset.data.map(function (d) { return d[constants_1.SPLIT].findDatumByAttribute(continuousDimension.name, hoverRange); });
                var colorValues = colors.getColors(dataset.data.map(function (d) { return d[categoryDimension.name]; }));
                var colorEntries = dataset.data.map(function (d, i) {
                    var segment = d[categoryDimension.name];
                    var hoverDatum = hoverDatums[i];
                    if (!hoverDatum)
                        return null;
                    return {
                        color: colorValues[i],
                        segmentLabel: String(segment),
                        measureLabel: measure.formatDatum(hoverDatum)
                    };
                }).filter(Boolean);
                return React.createElement(index_2.HoverMultiBubble, {left: leftOffset, top: topOffset + HOVER_MULTI_BUBBLE_V_OFFSET, segmentLabel: segmentLabel, colorEntries: colorEntries});
            }
            else {
                var hoverDatum = dataset.findDatumByAttribute(continuousDimension.name, hoverRange);
                if (!hoverDatum)
                    return null;
                var segmentLabel = formatter_1.formatValue(hoverRange, timezone, time_1.DisplayYear.NEVER);
                return React.createElement(index_2.SegmentBubble, {left: leftOffset, top: topOffset + HOVER_BUBBLE_V_OFFSET, segmentLabel: segmentLabel, measureLabel: measure.formatDatum(hoverDatum)});
            }
        }
        return null;
    };
    LineChart.prototype.renderChart = function (dataset, measure, chartIndex, containerStage, chartStage) {
        var _a = this.props, essence = _a.essence, isThumbnail = _a.isThumbnail;
        var _b = this.state, hoverRange = _b.hoverRange, hoverMeasure = _b.hoverMeasure, dragRange = _b.dragRange, scaleX = _b.scaleX, xTicks = _b.xTicks, continuousDimension = _b.continuousDimension;
        var splits = essence.splits, colors = essence.colors;
        var splitLength = splits.length();
        var lineStage = chartStage.within({ top: TEXT_SPACER, right: Y_AXIS_WIDTH, bottom: 1 });
        var yAxisStage = chartStage.within({ top: TEXT_SPACER, left: lineStage.width, bottom: 1 });
        var measureName = measure.name;
        var getX = function (d) { return d[continuousDimension.name]; };
        var getY = function (d) { return d[measureName]; };
        var myDatum = dataset.data[0];
        var mySplitDataset = myDatum[constants_1.SPLIT];
        var extentY = null;
        if (splitLength === 1) {
            extentY = d3.extent(mySplitDataset.data, getY);
        }
        else {
            var minY = 0;
            var maxY = 0;
            mySplitDataset.data.forEach(function (datum) {
                var subDataset = datum[constants_1.SPLIT];
                if (subDataset) {
                    var tempExtentY = d3.extent(subDataset.data, getY);
                    minY = Math.min(tempExtentY[0], minY);
                    maxY = Math.max(tempExtentY[1], maxY);
                }
            });
            extentY = [minY, maxY];
        }
        var horizontalGridLines;
        var chartLines;
        var verticalAxis;
        var bubble;
        if (!isNaN(extentY[0]) && !isNaN(extentY[1])) {
            var scaleY_1 = d3.scale.linear()
                .domain([Math.min(extentY[0] * 1.1, 0), Math.max(extentY[1] * 1.1, 0)])
                .range([lineStage.height, 0]);
            var yTicks = scaleY_1.ticks(5).filter(function (n) { return n !== 0; });
            horizontalGridLines = React.createElement(index_2.GridLines, {orientation: "horizontal", scale: scaleY_1, ticks: yTicks, stage: lineStage});
            verticalAxis = React.createElement(index_2.VerticalAxis, {stage: yAxisStage, ticks: yTicks, scale: scaleY_1});
            if (splitLength === 1) {
                chartLines = [];
                chartLines.push(React.createElement(index_2.ChartLine, {key: 'single', dataset: mySplitDataset, getX: getX, getY: getY, scaleX: scaleX, scaleY: scaleY_1, stage: lineStage, showArea: true, hoverRange: (!dragRange && hoverMeasure === measure) ? hoverRange : null, color: "default"}));
            }
            else {
                var colorValues = null;
                var categoryDimension = essence.splits.get(0).getDimension(essence.dataCube.dimensions);
                if (colors)
                    colorValues = colors.getColors(mySplitDataset.data.map(function (d) { return d[categoryDimension.name]; }));
                chartLines = mySplitDataset.data.map(function (datum, i) {
                    var subDataset = datum[constants_1.SPLIT];
                    if (!subDataset)
                        return null;
                    return React.createElement(index_2.ChartLine, {key: 'single' + i, dataset: subDataset, getX: getX, getY: getY, scaleX: scaleX, scaleY: scaleY_1, stage: lineStage, showArea: false, hoverRange: (!dragRange && hoverMeasure === measure) ? hoverRange : null, color: colorValues ? colorValues[i] : null});
                });
            }
            bubble = this.renderChartBubble(mySplitDataset, measure, chartIndex, containerStage, chartStage, extentY, scaleY_1);
        }
        return React.createElement("div", {className: "measure-line-chart", key: measureName, onMouseDown: this.onMouseDown.bind(this, measure), onMouseMove: this.onMouseMove.bind(this, mySplitDataset, measure, scaleX), onMouseLeave: this.onMouseLeave.bind(this, measure)}, 
            React.createElement("svg", {style: chartStage.getWidthHeight(), viewBox: chartStage.getViewBox()}, 
                horizontalGridLines, 
                React.createElement(index_2.GridLines, {orientation: "vertical", scale: scaleX, ticks: xTicks, stage: lineStage}), 
                chartLines, 
                verticalAxis, 
                React.createElement("line", {className: "vis-bottom", x1: "0", y1: chartStage.height - 0.5, x2: chartStage.width, y2: chartStage.height - 0.5})), 
            !isThumbnail ? React.createElement(index_2.VisMeasureLabel, {measure: measure, datum: myDatum}) : null, 
            this.renderHighlighter(), 
            bubble);
    };
    LineChart.prototype.precalculate = function (props, datasetLoad) {
        if (datasetLoad === void 0) { datasetLoad = null; }
        var registerDownloadableDataset = props.registerDownloadableDataset, essence = props.essence, timekeeper = props.timekeeper, stage = props.stage;
        var splits = essence.splits, timezone = essence.timezone, dataCube = essence.dataCube;
        var existingDatasetLoad = this.state.datasetLoad;
        var newState = {};
        if (datasetLoad) {
            if (datasetLoad.loading)
                datasetLoad.dataset = existingDatasetLoad.dataset;
            newState.datasetLoad = datasetLoad;
        }
        else {
            datasetLoad = this.state.datasetLoad;
        }
        if (splits.length()) {
            var dataset = datasetLoad.dataset;
            if (dataset) {
                if (registerDownloadableDataset)
                    registerDownloadableDataset(dataset);
            }
            var continuousSplit = splits.length() === 1 ? splits.get(0) : splits.get(1);
            var continuousDimension = continuousSplit.getDimension(essence.dataCube.dimensions);
            if (continuousDimension) {
                newState.continuousDimension = continuousDimension;
                var axisRange = essence.getEffectiveFilter(timekeeper, LineChart.id).getExtent(continuousDimension.expression);
                if (axisRange) {
                    var maxTime = dataCube.getMaxTime(timekeeper);
                    var continuousBucketAction = continuousSplit.bucketAction;
                    if (maxTime && continuousBucketAction instanceof plywood_1.TimeBucketAction) {
                        var continuousDuration = continuousBucketAction.duration;
                        var axisRangeEnd = axisRange.end;
                        var axisRangeEndFloor = continuousDuration.floor(axisRangeEnd, timezone);
                        var axisRangeEndCeil = continuousDuration.shift(axisRangeEndFloor, timezone);
                        if (maxTime && axisRangeEndFloor < maxTime && maxTime < axisRangeEndCeil) {
                            axisRange = plywood_1.Range.fromJS({ start: axisRange.start, end: axisRangeEndCeil });
                        }
                    }
                }
                else {
                    axisRange = this.getXAxisRange(dataset, continuousDimension);
                }
                if (axisRange) {
                    newState.axisRange = axisRange;
                    var domain = [(axisRange).start, (axisRange).end];
                    var range = [0, stage.width - constants_1.VIS_H_PADDING * 2 - Y_AXIS_WIDTH];
                    var scaleFn = null;
                    if (continuousDimension.kind === 'time') {
                        scaleFn = d3.time.scale();
                    }
                    else {
                        scaleFn = d3.scale.linear();
                    }
                    newState.scaleX = scaleFn.domain(domain).range(range);
                    newState.xTicks = granularity_1.getLineChartTicks(axisRange, timezone);
                }
            }
        }
        this.setState(newState);
    };
    LineChart.prototype.getXAxisRange = function (dataset, continuousDimension) {
        var _this = this;
        if (!dataset)
            return null;
        var key = continuousDimension.name;
        var firstDatum = dataset.data[0];
        var ranges;
        if (firstDatum['SPLIT']) {
            ranges = dataset.data.map(function (d) { return _this.getXAxisRange(d['SPLIT'], continuousDimension); });
        }
        else {
            ranges = dataset.data.map(function (d) { return d[key]; });
        }
        return ranges.reduce(function (a, b) { return (a && b) ? a.extend(b) : (a || b); });
    };
    LineChart.prototype.hideBubble = function () {
        var _a = this.state, hoverRange = _a.hoverRange, hoverMeasure = _a.hoverMeasure;
        if (!hoverRange || !hoverMeasure)
            return;
        this.setState({
            hoverRange: null,
            hoverMeasure: null
        });
    };
    LineChart.prototype.renderInternals = function () {
        var _this = this;
        var _a = this.props, essence = _a.essence, stage = _a.stage;
        var _b = this.state, datasetLoad = _b.datasetLoad, axisRange = _b.axisRange, scaleX = _b.scaleX, xTicks = _b.xTicks;
        var splits = essence.splits, timezone = essence.timezone;
        var measureCharts;
        var bottomAxis;
        if (datasetLoad.dataset && splits.length() && axisRange) {
            var measures = essence.getEffectiveMeasures().toArray();
            var chartWidth = stage.width - constants_1.VIS_H_PADDING * 2;
            var chartHeight = Math.max(MIN_CHART_HEIGHT, Math.floor(Math.min(chartWidth / MAX_ASPECT_RATIO, (stage.height - X_AXIS_HEIGHT) / measures.length)));
            var chartStage = new index_1.Stage({
                x: constants_1.VIS_H_PADDING,
                y: 0,
                width: chartWidth,
                height: chartHeight
            });
            measureCharts = measures.map(function (measure, chartIndex) {
                return _this.renderChart(datasetLoad.dataset, measure, chartIndex, stage, chartStage);
            });
            var xAxisStage = index_1.Stage.fromSize(chartStage.width, X_AXIS_HEIGHT);
            bottomAxis = React.createElement("svg", {className: "bottom-axis", width: xAxisStage.width, height: xAxisStage.height}, 
                React.createElement(index_2.LineChartAxis, {stage: xAxisStage, ticks: xTicks, scale: scaleX, timezone: timezone})
            );
        }
        var measureChartsStyle = {
            maxHeight: stage.height - X_AXIS_HEIGHT
        };
        return React.createElement("div", {className: "internals line-chart-inner"}, 
            React.createElement(index_2.GlobalEventListener, {scroll: this.hideBubble.bind(this)}), 
            React.createElement("div", {className: "measure-line-charts", style: measureChartsStyle, ref: "container"}, measureCharts), 
            bottomAxis);
    };
    LineChart.id = line_chart_1.LINE_CHART_MANIFEST.name;
    return LineChart;
}(base_visualization_1.BaseVisualization));
exports.LineChart = LineChart;
