"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./bar-chart.css');
var React = require('react');
var ReactDOM = require('react-dom');
var immutable_1 = require('immutable');
var plywood_1 = require('plywood');
var index_1 = require('../../../common/models/index');
var bar_chart_1 = require('../../../common/manifests/bar-chart/bar-chart');
var formatter_1 = require('../../../common/utils/formatter/formatter');
var time_1 = require('../../../common/utils/time/time');
var constants_1 = require('../../config/constants');
var dom_1 = require('../../utils/dom/dom');
var index_2 = require('../../components/index');
var base_visualization_1 = require('../base-visualization/base-visualization');
var bar_coordinates_1 = require('./bar-coordinates');
var X_AXIS_HEIGHT = 84;
var Y_AXIS_WIDTH = 60;
var CHART_TOP_PADDING = 10;
var CHART_BOTTOM_PADDING = 0;
var MIN_CHART_HEIGHT = 200;
var MAX_STEP_WIDTH = 140;
var MIN_STEP_WIDTH = 20;
var BAR_PROPORTION = 0.8;
var BARS_MIN_PAD_LEFT = 30;
var BARS_MIN_PAD_RIGHT = 6;
var HOVER_BUBBLE_V_OFFSET = 8;
var SELECTION_PAD = 4;
function getFilterFromDatum(splits, dataPath, dataCube) {
    return new index_1.Filter(immutable_1.List(dataPath.map(function (datum, i) {
        var split = splits.get(i);
        var segment = datum[split.getDimension(dataCube.dimensions).name];
        return new index_1.FilterClause({
            expression: split.expression,
            selection: plywood_1.r(plywood_1.TimeRange.isTimeRange(segment) ? segment : plywood_1.Set.fromJS([segment]))
        });
    })));
}
function padDataset(originalDataset, dimension, measures) {
    var data = originalDataset.data[0][constants_1.SPLIT].data;
    var dimensionName = dimension.name;
    var firstBucket = data[0][dimensionName];
    if (!firstBucket)
        return originalDataset;
    var start = Number(firstBucket.start);
    var end = Number(firstBucket.end);
    var size = end - start;
    var i = start;
    var j = 0;
    var filledData = [];
    data.forEach(function (d) {
        var segmentValue = d[dimensionName];
        var segmentStart = segmentValue.start;
        while (i < segmentStart) {
            filledData[j] = {};
            filledData[j][dimensionName] = plywood_1.NumberRange.fromJS({
                start: i,
                end: i + size
            });
            measures.forEach(function (m) {
                filledData[j][m.name] = 0;
            });
            if (d[constants_1.SPLIT]) {
                filledData[j][constants_1.SPLIT] = new plywood_1.Dataset({
                    data: [],
                    attributes: []
                });
            }
            j++;
            i += size;
        }
        filledData[j] = d;
        i += size;
        j++;
    });
    var value = originalDataset.valueOf();
    value.data[0][constants_1.SPLIT].data = filledData;
    return new plywood_1.Dataset(value);
}
function padDatasetLoad(datasetLoad, dimension, measures) {
    var originalDataset = datasetLoad.dataset;
    var newDataset = originalDataset ? padDataset(originalDataset, dimension, measures) : null;
    datasetLoad.dataset = newDataset;
    return datasetLoad;
}
var BarChart = (function (_super) {
    __extends(BarChart, _super);
    function BarChart() {
        _super.call(this);
        this.coordinatesCache = [];
    }
    BarChart.prototype.getDefaultState = function () {
        var s = _super.prototype.getDefaultState.call(this);
        s.hoverInfo = null;
        return s;
    };
    BarChart.prototype.componentWillReceiveProps = function (nextProps) {
        this.precalculate(nextProps);
        var _a = this.props, essence = _a.essence, timekeeper = _a.timekeeper;
        var nextEssence = nextProps.essence;
        var nextTimekeeper = nextProps.timekeeper;
        if (nextEssence.differentDataCube(essence) ||
            nextEssence.differentEffectiveFilter(essence, timekeeper, nextTimekeeper, BarChart.id) ||
            nextEssence.differentEffectiveSplits(essence) ||
            nextEssence.newEffectiveMeasures(essence)) {
            this.fetchData(nextEssence, nextTimekeeper);
        }
    };
    BarChart.prototype.componentDidUpdate = function () {
        var _a = this.state, scrollerYPosition = _a.scrollerYPosition, scrollerXPosition = _a.scrollerXPosition;
        var node = ReactDOM.findDOMNode(this.refs['scroller']);
        if (!node)
            return;
        var rect = node.getBoundingClientRect();
        if (scrollerYPosition !== rect.top || scrollerXPosition !== rect.left) {
            this.setState({ scrollerYPosition: rect.top, scrollerXPosition: rect.left });
        }
    };
    BarChart.prototype.calculateMousePosition = function (x, y) {
        var essence = this.props.essence;
        var measures = essence.getEffectiveMeasures().toArray();
        var chartStage = this.getSingleChartStage();
        var chartHeight = this.getOuterChartHeight(chartStage);
        if (y >= chartHeight * measures.length)
            return null;
        if (x >= chartStage.width)
            return null;
        var xScale = this.getPrimaryXScale();
        var chartIndex = Math.floor(y / chartHeight);
        var chartCoordinates = this.getBarsCoordinates(chartIndex, xScale);
        var _a = this.findBarCoordinatesForX(x, chartCoordinates, []), path = _a.path, coordinates = _a.coordinates;
        return {
            path: this.findPathForIndices(path),
            measure: measures[chartIndex],
            chartIndex: chartIndex,
            coordinates: coordinates
        };
    };
    BarChart.prototype.findPathForIndices = function (indices) {
        var datasetLoad = this.state.datasetLoad;
        var mySplitDataset = datasetLoad.dataset.data[0][constants_1.SPLIT];
        var path = [];
        var currentData = mySplitDataset;
        indices.forEach(function (i) {
            var datum = currentData.data[i];
            path.push(datum);
            currentData = datum[constants_1.SPLIT];
        });
        return path;
    };
    BarChart.prototype.findBarCoordinatesForX = function (x, coordinates, currentPath) {
        for (var i = 0; i < coordinates.length; i++) {
            if (coordinates[i].isXWithin(x)) {
                currentPath.push(i);
                if (coordinates[i].hasChildren()) {
                    return this.findBarCoordinatesForX(x, coordinates[i].children, currentPath);
                }
                else {
                    return { path: currentPath, coordinates: coordinates[i] };
                }
            }
        }
        return { path: [], coordinates: null };
    };
    BarChart.prototype.onScrollerScroll = function (scrollTop, scrollLeft) {
        this.setState({
            hoverInfo: null,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop
        });
    };
    BarChart.prototype.onMouseMove = function (x, y) {
        this.setState({ hoverInfo: this.calculateMousePosition(x, y) });
    };
    BarChart.prototype.onMouseLeave = function () {
        this.setState({ hoverInfo: null });
    };
    BarChart.prototype.onClick = function (x, y) {
        var _a = this.props, essence = _a.essence, clicker = _a.clicker;
        if (!clicker.changeHighlight || !clicker.dropHighlight)
            return;
        var selectionInfo = this.calculateMousePosition(x, y);
        if (!selectionInfo)
            return;
        if (!selectionInfo.coordinates) {
            clicker.dropHighlight();
            this.setState({ selectionInfo: null });
            return;
        }
        var path = selectionInfo.path, chartIndex = selectionInfo.chartIndex;
        var splits = essence.splits, dataCube = essence.dataCube;
        var measures = essence.getEffectiveMeasures().toArray();
        var rowHighlight = getFilterFromDatum(splits, path, dataCube);
        if (essence.highlightOn(BarChart.id, measures[chartIndex].name)) {
            if (rowHighlight.equals(essence.highlight.delta)) {
                clicker.dropHighlight();
                this.setState({ selectionInfo: null });
                return;
            }
        }
        this.setState({ selectionInfo: selectionInfo });
        clicker.changeHighlight(BarChart.id, measures[chartIndex].name, rowHighlight);
    };
    BarChart.prototype.getYExtent = function (data, measure) {
        var measureName = measure.name;
        var getY = function (d) { return d[measureName]; };
        return d3.extent(data, getY);
    };
    BarChart.prototype.getYScale = function (measure, yAxisStage) {
        var essence = this.props.essence;
        var flatData = this.state.flatData;
        var splitLength = essence.splits.length();
        var leafData = flatData.filter(function (d) { return d['__nest'] === splitLength - 1; });
        var extentY = this.getYExtent(leafData, measure);
        return d3.scale.linear()
            .domain([Math.min(extentY[0] * 1.1, 0), Math.max(extentY[1] * 1.1, 0)])
            .range([yAxisStage.height, yAxisStage.y]);
    };
    BarChart.prototype.hasValidYExtent = function (measure, data) {
        var _a = this.getYExtent(data, measure), yMin = _a[0], yMax = _a[1];
        return !isNaN(yMin) && !isNaN(yMax);
    };
    BarChart.prototype.getSingleChartStage = function () {
        var xScale = this.getPrimaryXScale();
        var _a = this.props, essence = _a.essence, stage = _a.stage, isThumbnail = _a.isThumbnail;
        var stepWidth = this.getBarDimensions(xScale.rangeBand()).stepWidth;
        var xTicks = xScale.domain();
        var width = xTicks.length > 0 ? dom_1.roundToPx(xScale(xTicks[xTicks.length - 1])) + stepWidth : 0;
        var measures = essence.getEffectiveMeasures();
        var availableHeight = stage.height - X_AXIS_HEIGHT;
        var minHeight = isThumbnail ? 1 : MIN_CHART_HEIGHT;
        var height = Math.max(minHeight, Math.floor(availableHeight / measures.size));
        return new index_1.Stage({
            x: 0,
            y: CHART_TOP_PADDING,
            width: Math.max(width, stage.width - Y_AXIS_WIDTH - constants_1.VIS_H_PADDING * 2),
            height: height - CHART_TOP_PADDING - CHART_BOTTOM_PADDING
        });
    };
    BarChart.prototype.getOuterChartHeight = function (chartStage) {
        return chartStage.height + CHART_TOP_PADDING + CHART_BOTTOM_PADDING;
    };
    BarChart.prototype.getAxisStages = function (chartStage) {
        var _a = this.props, essence = _a.essence, stage = _a.stage;
        var xHeight = Math.max(stage.height - (CHART_TOP_PADDING + CHART_BOTTOM_PADDING + chartStage.height) * essence.getEffectiveMeasures().size, X_AXIS_HEIGHT);
        return {
            xAxisStage: new index_1.Stage({ x: chartStage.x, y: 0, height: xHeight, width: chartStage.width }),
            yAxisStage: new index_1.Stage({ x: 0, y: chartStage.y, height: chartStage.height, width: Y_AXIS_WIDTH + constants_1.VIS_H_PADDING })
        };
    };
    BarChart.prototype.getScrollerLayout = function (chartStage, xAxisStage, yAxisStage) {
        var essence = this.props.essence;
        var measures = essence.getEffectiveMeasures().toArray();
        var oneChartHeight = this.getOuterChartHeight(chartStage);
        return {
            bodyWidth: chartStage.width,
            bodyHeight: oneChartHeight * measures.length - CHART_BOTTOM_PADDING,
            top: 0,
            right: yAxisStage.width,
            bottom: xAxisStage.height,
            left: 0
        };
    };
    BarChart.prototype.getBubbleTopOffset = function (y, chartIndex, chartStage) {
        var _a = this.state, scrollTop = _a.scrollTop, scrollerYPosition = _a.scrollerYPosition;
        var oneChartHeight = this.getOuterChartHeight(chartStage);
        var chartsAboveMe = oneChartHeight * chartIndex;
        return chartsAboveMe - scrollTop + scrollerYPosition + y - HOVER_BUBBLE_V_OFFSET + CHART_TOP_PADDING;
    };
    BarChart.prototype.getBubbleLeftOffset = function (x) {
        var stage = this.props.stage;
        var _a = this.state, scrollLeft = _a.scrollLeft, scrollerXPosition = _a.scrollerXPosition;
        return scrollerXPosition + x - scrollLeft;
    };
    BarChart.prototype.canShowBubble = function (leftOffset, topOffset) {
        var stage = this.props.stage;
        var _a = this.state, scrollLeft = _a.scrollLeft, scrollerYPosition = _a.scrollerYPosition, scrollerXPosition = _a.scrollerXPosition;
        if (topOffset <= 0)
            return false;
        if (topOffset > scrollerYPosition + stage.height - X_AXIS_HEIGHT)
            return false;
        if (leftOffset <= 0)
            return false;
        if (leftOffset > scrollerXPosition + stage.width - Y_AXIS_WIDTH)
            return false;
        return true;
    };
    BarChart.prototype.renderSelectionBubble = function (hoverInfo) {
        var _a = this.props, essence = _a.essence, stage = _a.stage, clicker = _a.clicker, openRawDataModal = _a.openRawDataModal;
        var measure = hoverInfo.measure, path = hoverInfo.path, chartIndex = hoverInfo.chartIndex, segmentLabel = hoverInfo.segmentLabel, coordinates = hoverInfo.coordinates;
        var chartStage = this.getSingleChartStage();
        var splits = essence.splits, dataCube = essence.dataCube;
        var dimension = splits.get(hoverInfo.splitIndex).getDimension(dataCube.dimensions);
        var leftOffset = this.getBubbleLeftOffset(coordinates.middleX);
        var topOffset = this.getBubbleTopOffset(coordinates.y, chartIndex, chartStage);
        if (!this.canShowBubble(leftOffset, topOffset))
            return null;
        return React.createElement(index_2.SegmentBubble, {left: leftOffset, top: topOffset, dimension: dimension, segmentLabel: segmentLabel, measureLabel: measure.formatDatum(path[path.length - 1]), clicker: clicker, openRawDataModal: openRawDataModal, onClose: this.onBubbleClose.bind(this)});
    };
    BarChart.prototype.onBubbleClose = function () {
        this.setState({ selectionInfo: null });
    };
    BarChart.prototype.renderHoverBubble = function (hoverInfo) {
        var stage = this.props.stage;
        var chartStage = this.getSingleChartStage();
        var measure = hoverInfo.measure, path = hoverInfo.path, chartIndex = hoverInfo.chartIndex, segmentLabel = hoverInfo.segmentLabel, coordinates = hoverInfo.coordinates;
        var leftOffset = this.getBubbleLeftOffset(coordinates.middleX);
        var topOffset = this.getBubbleTopOffset(coordinates.y, chartIndex, chartStage);
        if (!this.canShowBubble(leftOffset, topOffset))
            return null;
        return React.createElement(index_2.SegmentBubble, {top: topOffset, left: leftOffset, segmentLabel: segmentLabel, measureLabel: measure.formatDatum(path[path.length - 1])});
    };
    BarChart.prototype.isSelected = function (path, measure) {
        var essence = this.props.essence;
        var splits = essence.splits, dataCube = essence.dataCube;
        if (essence.highlightOnDifferentMeasure(BarChart.id, measure.name))
            return false;
        if (essence.highlightOn(BarChart.id, measure.name)) {
            return essence.highlight.delta.equals(getFilterFromDatum(splits, path, dataCube));
        }
        return false;
    };
    BarChart.prototype.isFaded = function () {
        var essence = this.props.essence;
        return essence.highlightOn(BarChart.id);
    };
    BarChart.prototype.hasAnySelectionGoingOn = function () {
        return this.props.essence.highlightOn(BarChart.id);
    };
    BarChart.prototype.isHovered = function (path, measure) {
        var essence = this.props.essence;
        var hoverInfo = this.state.hoverInfo;
        var splits = essence.splits, dataCube = essence.dataCube;
        if (this.hasAnySelectionGoingOn())
            return false;
        if (!hoverInfo)
            return false;
        if (hoverInfo.measure !== measure)
            return false;
        var filter = function (p) { return getFilterFromDatum(splits, p, dataCube); };
        return filter(hoverInfo.path).equals(filter(path));
    };
    BarChart.prototype.renderBars = function (data, measure, chartIndex, chartStage, xAxisStage, coordinates, splitIndex, path) {
        var _this = this;
        if (splitIndex === void 0) { splitIndex = 0; }
        if (path === void 0) { path = []; }
        var essence = this.props.essence;
        var timezone = essence.timezone;
        var bars = [];
        var highlight;
        var dimension = essence.splits.get(splitIndex).getDimension(essence.dataCube.dimensions);
        var splitLength = essence.splits.length();
        data.forEach(function (d, i) {
            var segmentValue = d[dimension.name];
            var segmentValueStr = formatter_1.formatValue(segmentValue, timezone, time_1.DisplayYear.NEVER);
            var subPath = path.concat(d);
            var bar;
            var bubble = null;
            var subCoordinates = coordinates[i];
            var _a = coordinates[i], x = _a.x, y = _a.y, height = _a.height, barWidth = _a.barWidth, barOffset = _a.barOffset;
            if (splitIndex < splitLength - 1) {
                var subData = d[constants_1.SPLIT].data;
                var subRender = _this.renderBars(subData, measure, chartIndex, chartStage, xAxisStage, subCoordinates.children, splitIndex + 1, subPath);
                bar = subRender.bars;
                if (!highlight && subRender.highlight)
                    highlight = subRender.highlight;
            }
            else {
                var bubbleInfo = {
                    measure: measure,
                    chartIndex: chartIndex,
                    path: subPath,
                    coordinates: subCoordinates,
                    segmentLabel: segmentValueStr,
                    splitIndex: splitIndex
                };
                var isHovered = _this.isHovered(subPath, measure);
                if (isHovered) {
                    bubble = _this.renderHoverBubble(bubbleInfo);
                }
                var selected = _this.isSelected(subPath, measure);
                var faded = _this.isFaded();
                if (selected) {
                    bubble = _this.renderSelectionBubble(bubbleInfo);
                    if (bubble)
                        highlight = _this.renderSelectionHighlight(chartStage, subCoordinates, chartIndex);
                }
                bar = React.createElement("g", {className: dom_1.classNames('bar', { selected: selected, 'not-selected': (!selected && faded), isHovered: isHovered }), key: String(segmentValue), transform: "translate(" + dom_1.roundToPx(x) + ", 0)"}, 
                    React.createElement("rect", {className: "background", width: dom_1.roundToPx(barWidth), height: dom_1.roundToPx(Math.abs(height)), x: barOffset, y: dom_1.roundToPx(y)}), 
                    bubble);
            }
            bars.push(bar);
        });
        return { bars: bars, highlight: highlight };
    };
    BarChart.prototype.renderSelectionHighlight = function (chartStage, coordinates, chartIndex) {
        var _a = this.state, scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
        var chartHeight = this.getOuterChartHeight(chartStage);
        var barWidth = coordinates.barWidth, height = coordinates.height, barOffset = coordinates.barOffset, y = coordinates.y, x = coordinates.x;
        var leftOffset = dom_1.roundToPx(x) + barOffset - SELECTION_PAD + chartStage.x - scrollLeft;
        var topOffset = dom_1.roundToPx(y) - SELECTION_PAD + chartStage.y - scrollTop + chartHeight * chartIndex;
        var style = {
            left: leftOffset,
            top: topOffset,
            width: dom_1.roundToPx(barWidth + SELECTION_PAD * 2),
            height: dom_1.roundToPx(Math.abs(height) + SELECTION_PAD * 2)
        };
        return React.createElement("div", {className: "selection-highlight", style: style});
    };
    BarChart.prototype.renderXAxis = function (data, coordinates, xAxisStage) {
        var essence = this.props.essence;
        var xScale = this.getPrimaryXScale();
        var xTicks = xScale.domain();
        var split = essence.splits.get(0);
        var dimension = split.getDimension(essence.dataCube.dimensions);
        var labels = [];
        if (dimension.canBucketByDefault()) {
            var lastIndex = data.length - 1;
            var ascending = split.sortAction.direction === plywood_1.SortAction.ASCENDING;
            var leftThing = ascending ? 'start' : 'end';
            var rightThing = ascending ? 'end' : 'start';
            data.forEach(function (d, i) {
                var segmentValue = d[dimension.name];
                var segmentValueStr = String(plywood_1.Range.isRange(segmentValue) ? segmentValue[leftThing] : '');
                var coordinate = coordinates[i];
                labels.push(React.createElement("div", {className: "slanty-label continuous", key: i, style: { right: xAxisStage.width - coordinate.x }}, segmentValueStr));
                if (i === lastIndex) {
                    segmentValueStr = String(plywood_1.Range.isRange(segmentValue) ? segmentValue[rightThing] : '');
                    labels.push(React.createElement("div", {className: "slanty-label continuous", key: "last-one", style: { right: xAxisStage.width - (coordinate.x + coordinate.stepWidth) }}, segmentValueStr));
                }
            });
        }
        else {
            data.forEach(function (d, i) {
                var segmentValueStr = String(d[dimension.name]);
                var coordinate = coordinates[i];
                labels.push(React.createElement("div", {className: "slanty-label categorical", key: segmentValueStr, style: { right: xAxisStage.width - (coordinate.x + coordinate.stepWidth / 2) }}, segmentValueStr));
            });
        }
        return React.createElement("div", {className: "x-axis", style: { width: xAxisStage.width }}, 
            React.createElement("svg", {style: xAxisStage.getWidthHeight(), viewBox: xAxisStage.getViewBox()}, 
                React.createElement(index_2.BucketMarks, {stage: xAxisStage, ticks: xTicks, scale: xScale})
            ), 
            labels);
    };
    BarChart.prototype.getYAxisStuff = function (dataset, measure, chartStage, chartIndex) {
        var yAxisStage = this.getAxisStages(chartStage).yAxisStage;
        var yScale = this.getYScale(measure, yAxisStage);
        var yTicks = yScale.ticks(5);
        var yGridLines = React.createElement(index_2.GridLines, {orientation: "horizontal", scale: yScale, ticks: yTicks, stage: chartStage});
        var axisStage = yAxisStage.changeY(yAxisStage.y + (chartStage.height + CHART_TOP_PADDING + CHART_BOTTOM_PADDING) * chartIndex);
        var yAxis = React.createElement(index_2.VerticalAxis, {key: measure.name, stage: axisStage, ticks: yTicks, scale: yScale, hideZero: true});
        return { yGridLines: yGridLines, yAxis: yAxis, yScale: yScale };
    };
    BarChart.prototype.isChartVisible = function (chartIndex, xAxisStage) {
        var stage = this.props.stage;
        var scrollTop = this.state.scrollTop;
        var chartStage = this.getSingleChartStage();
        var chartHeight = this.getOuterChartHeight(chartStage);
        var topY = chartIndex * chartHeight;
        var viewPortHeight = stage.height - xAxisStage.height;
        var hiddenAtBottom = topY - scrollTop >= viewPortHeight;
        var bottomY = topY + chartHeight;
        var hiddenAtTop = bottomY < scrollTop;
        return !hiddenAtTop && !hiddenAtBottom;
    };
    BarChart.prototype.renderChart = function (dataset, coordinates, measure, chartIndex, chartStage, getX) {
        var isThumbnail = this.props.isThumbnail;
        var mySplitDataset = dataset.data[0][constants_1.SPLIT];
        var measureLabel = !isThumbnail ? React.createElement(index_2.VisMeasureLabel, {measure: measure, datum: dataset.data[0]}) : null;
        if (!this.hasValidYExtent(measure, mySplitDataset.data)) {
            return {
                chart: React.createElement("div", {className: "measure-bar-chart", key: measure.name, style: { width: chartStage.width }}, 
                    React.createElement("svg", {style: chartStage.getWidthHeight(0, CHART_BOTTOM_PADDING), viewBox: chartStage.getViewBox(0, CHART_BOTTOM_PADDING)}), 
                    measureLabel),
                yAxis: null,
                highlight: null
            };
        }
        var xAxisStage = this.getAxisStages(chartStage).xAxisStage;
        var _a = this.getYAxisStuff(mySplitDataset, measure, chartStage, chartIndex), yAxis = _a.yAxis, yGridLines = _a.yGridLines;
        var bars;
        var highlight;
        if (this.isChartVisible(chartIndex, xAxisStage)) {
            var renderedChart = this.renderBars(mySplitDataset.data, measure, chartIndex, chartStage, xAxisStage, coordinates);
            bars = renderedChart.bars;
            highlight = renderedChart.highlight;
        }
        var chart = React.createElement("div", {className: "measure-bar-chart", key: measure.name, style: { width: chartStage.width }}, 
            React.createElement("svg", {style: chartStage.getWidthHeight(0, CHART_BOTTOM_PADDING), viewBox: chartStage.getViewBox(0, CHART_BOTTOM_PADDING)}, 
                yGridLines, 
                React.createElement("g", {className: "bars", transform: chartStage.getTransform()}, bars)), 
            measureLabel);
        return { chart: chart, yAxis: yAxis, highlight: highlight };
    };
    BarChart.prototype.precalculate = function (props, datasetLoad) {
        if (datasetLoad === void 0) { datasetLoad = null; }
        var registerDownloadableDataset = props.registerDownloadableDataset, essence = props.essence;
        var splits = essence.splits;
        var split = splits.get(0);
        var dimension = split.getDimension(essence.dataCube.dimensions);
        var dimensionKind = dimension.kind;
        var measures = essence.getEffectiveMeasures().toArray();
        this.coordinatesCache = [];
        var existingDatasetLoad = this.state.datasetLoad;
        var newState = {};
        if (datasetLoad) {
            if (dimensionKind === 'number') {
                datasetLoad = padDatasetLoad(datasetLoad, dimension, measures);
            }
            if (datasetLoad.loading)
                datasetLoad.dataset = existingDatasetLoad.dataset;
            newState.datasetLoad = datasetLoad;
        }
        else {
            var stateDatasetLoad = this.state.datasetLoad;
            if (dimensionKind === 'number') {
                datasetLoad = padDatasetLoad(stateDatasetLoad, dimension, measures);
            }
            else {
                datasetLoad = stateDatasetLoad;
            }
        }
        var dataset = datasetLoad.dataset;
        if (dataset && splits.length()) {
            var firstSplitDataSet = dataset.data[0][constants_1.SPLIT];
            if (registerDownloadableDataset)
                registerDownloadableDataset(dataset);
            var flatData = firstSplitDataSet.flatten({
                order: 'preorder',
                nestingName: '__nest',
                parentName: '__parent'
            });
            var maxima = splits.toArray().map(function () { return 0; });
            this.maxNumberOfLeaves(firstSplitDataSet.data, maxima, 0);
            newState.maxNumberOfLeaves = maxima;
            newState.flatData = flatData;
        }
        this.setState(newState);
    };
    BarChart.prototype.maxNumberOfLeaves = function (data, maxima, level) {
        maxima[level] = Math.max(maxima[level], data.length);
        if (data[0] && data[0][constants_1.SPLIT] !== undefined) {
            var n = data.length;
            for (var i = 0; i < n; i++) {
                this.maxNumberOfLeaves(data[i][constants_1.SPLIT].data, maxima, level + 1);
            }
        }
    };
    BarChart.prototype.getPrimaryXScale = function () {
        var _a = this.state, datasetLoad = _a.datasetLoad, maxNumberOfLeaves = _a.maxNumberOfLeaves;
        var data = datasetLoad.dataset.data[0][constants_1.SPLIT].data;
        var essence = this.props.essence;
        var splits = essence.splits, dataCube = essence.dataCube;
        var dimension = splits.get(0).getDimension(dataCube.dimensions);
        var getX = function (d) { return d[dimension.name]; };
        var _b = this.getXValues(maxNumberOfLeaves), usedWidth = _b.usedWidth, padLeft = _b.padLeft;
        return d3.scale.ordinal()
            .domain(data.map(getX))
            .rangeBands([padLeft, padLeft + usedWidth]);
    };
    BarChart.prototype.getBarDimensions = function (xRangeBand) {
        if (isNaN(xRangeBand))
            xRangeBand = 0;
        var stepWidth = xRangeBand;
        var barWidth = Math.max(stepWidth * BAR_PROPORTION, 0);
        var barOffset = (stepWidth - barWidth) / 2;
        return { stepWidth: stepWidth, barWidth: barWidth, barOffset: barOffset };
    };
    BarChart.prototype.getXValues = function (maxNumberOfLeaves) {
        var _a = this.props, essence = _a.essence, stage = _a.stage;
        var overallWidth = stage.width - constants_1.VIS_H_PADDING * 2 - Y_AXIS_WIDTH;
        var numPrimarySteps = maxNumberOfLeaves[0];
        var minStepWidth = MIN_STEP_WIDTH * maxNumberOfLeaves.slice(1).reduce((function (a, b) { return a * b; }), 1);
        var maxAvailableWidth = overallWidth - BARS_MIN_PAD_LEFT - BARS_MIN_PAD_RIGHT;
        var stepWidth;
        if (minStepWidth * numPrimarySteps < maxAvailableWidth) {
            stepWidth = Math.max(Math.min(maxAvailableWidth / numPrimarySteps, MAX_STEP_WIDTH * essence.splits.length()), MIN_STEP_WIDTH);
        }
        else {
            stepWidth = minStepWidth;
        }
        var usedWidth = stepWidth * maxNumberOfLeaves[0];
        var padLeft = Math.max(BARS_MIN_PAD_LEFT, (overallWidth - usedWidth) / 2);
        return { padLeft: padLeft, usedWidth: usedWidth };
    };
    BarChart.prototype.getBarsCoordinates = function (chartIndex, xScale) {
        if (!!this.coordinatesCache[chartIndex]) {
            return this.coordinatesCache[chartIndex];
        }
        var essence = this.props.essence;
        var datasetLoad = this.state.datasetLoad;
        var splits = essence.splits, dataCube = essence.dataCube;
        var measure = essence.getEffectiveMeasures().toArray()[chartIndex];
        var dataset = datasetLoad.dataset.data[0][constants_1.SPLIT];
        var dimension = splits.get(0).getDimension(dataCube.dimensions);
        var chartStage = this.getSingleChartStage();
        var yScale = this.getYAxisStuff(dataset, measure, chartStage, chartIndex).yScale;
        this.coordinatesCache[chartIndex] = this.getSubCoordinates(dataset.data, measure, chartStage, function (d) { return d[dimension.name]; }, xScale, yScale);
        return this.coordinatesCache[chartIndex];
    };
    BarChart.prototype.getSubCoordinates = function (data, measure, chartStage, getX, xScale, scaleY, splitIndex) {
        var _this = this;
        if (splitIndex === void 0) { splitIndex = 1; }
        var essence = this.props.essence;
        var maxNumberOfLeaves = this.state.maxNumberOfLeaves;
        var _a = this.getBarDimensions(xScale.rangeBand()), stepWidth = _a.stepWidth, barWidth = _a.barWidth, barOffset = _a.barOffset;
        var coordinates = data.map(function (d, i) {
            var x = xScale(getX(d, i));
            var y = scaleY(d[measure.name]);
            var h = scaleY(0) - y;
            var children = [];
            var coordinate = new bar_coordinates_1.BarCoordinates({
                x: x,
                y: h >= 0 ? y : scaleY(0),
                width: dom_1.roundToPx(barWidth),
                height: dom_1.roundToPx(Math.abs(h)),
                stepWidth: stepWidth,
                barWidth: barWidth,
                barOffset: barOffset,
                children: children
            });
            if (splitIndex < essence.splits.length()) {
                var subStage = new index_1.Stage({ x: x, y: chartStage.y, width: barWidth, height: chartStage.height });
                var subGetX = function (d, i) { return String(i); };
                var subData = d[constants_1.SPLIT].data;
                var subxScale = d3.scale.ordinal()
                    .domain(d3.range(0, maxNumberOfLeaves[splitIndex]).map(String))
                    .rangeBands([x + barOffset, x + subStage.width]);
                coordinate.children = _this.getSubCoordinates(subData, measure, subStage, subGetX, subxScale, scaleY, splitIndex + 1);
            }
            return coordinate;
        });
        return coordinates;
    };
    BarChart.prototype.renderRightGutter = function (measures, yAxisStage, yAxes) {
        var yAxesStage = yAxisStage.changeHeight((yAxisStage.height + CHART_TOP_PADDING + CHART_BOTTOM_PADDING) * measures.length);
        return React.createElement("svg", {style: yAxesStage.getWidthHeight(), viewBox: yAxesStage.getViewBox()}, yAxes);
    };
    BarChart.prototype.renderSelectionContainer = function (selectionHighlight, chartIndex, chartStage) {
        var _a = this.state, scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
        var chartHeight = this.getOuterChartHeight(chartStage);
        return React.createElement("div", {className: "selection-highlight-container"}, selectionHighlight);
    };
    BarChart.prototype.renderInternals = function () {
        var _this = this;
        var _a = this.props, essence = _a.essence, stage = _a.stage;
        var datasetLoad = this.state.datasetLoad;
        var splits = essence.splits, dataCube = essence.dataCube;
        var dimension = splits.get(0).getDimension(dataCube.dimensions);
        var scrollerLayout;
        var measureCharts = [];
        var xAxis;
        var rightGutter;
        var overlay;
        if (datasetLoad.dataset && splits.length()) {
            var xScale_1 = this.getPrimaryXScale();
            var yAxes_1 = [];
            var highlights = [];
            var measures = essence.getEffectiveMeasures().toArray();
            var getX_1 = function (d) { return d[dimension.name]; };
            var chartStage_1 = this.getSingleChartStage();
            var _b = this.getAxisStages(chartStage_1), xAxisStage = _b.xAxisStage, yAxisStage = _b.yAxisStage;
            xAxis = this.renderXAxis(datasetLoad.dataset.data[0][constants_1.SPLIT].data, this.getBarsCoordinates(0, xScale_1), xAxisStage);
            measures.forEach(function (measure, chartIndex) {
                var coordinates = _this.getBarsCoordinates(chartIndex, xScale_1);
                var _a = _this.renderChart(datasetLoad.dataset, coordinates, measure, chartIndex, chartStage_1, getX_1), yAxis = _a.yAxis, chart = _a.chart, highlight = _a.highlight;
                measureCharts.push(chart);
                yAxes_1.push(yAxis);
                if (highlight) {
                    overlay = _this.renderSelectionContainer(highlight, chartIndex, chartStage_1);
                }
            });
            scrollerLayout = this.getScrollerLayout(chartStage_1, xAxisStage, yAxisStage);
            rightGutter = this.renderRightGutter(measures, chartStage_1, yAxes_1);
        }
        return React.createElement("div", {className: "internals measure-bar-charts", style: { maxHeight: stage.height }}, 
            React.createElement(index_2.Scroller, {layout: scrollerLayout, ref: "scroller", bottomGutter: xAxis, rightGutter: rightGutter, body: measureCharts, overlay: overlay, onClick: this.onClick.bind(this), onMouseMove: this.onMouseMove.bind(this), onMouseLeave: this.onMouseLeave.bind(this), onScroll: this.onScrollerScroll.bind(this)})
        );
    };
    BarChart.id = bar_chart_1.BAR_CHART_MANIFEST.name;
    return BarChart;
}(base_visualization_1.BaseVisualization));
exports.BarChart = BarChart;
