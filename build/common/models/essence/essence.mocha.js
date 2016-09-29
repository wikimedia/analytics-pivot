"use strict";
var chai_1 = require('chai');
var immutable_class_tester_1 = require('immutable-class-tester');
var plywood_1 = require('plywood');
var index_1 = require("../../manifests/index");
var essence_1 = require('./essence');
var data_cube_1 = require("../data-cube/data-cube");
var data_cube_mock_1 = require("../data-cube/data-cube.mock");
var totals_1 = require("../../manifests/totals/totals");
var splits_1 = require("../splits/splits");
var bar_chart_1 = require("../../manifests/bar-chart/bar-chart");
var split_combine_1 = require("../split-combine/split-combine");
describe('Essence', function () {
    var dataCubeJS = {
        name: 'twitter',
        title: 'Twitter',
        clusterName: 'druid',
        source: 'twitter',
        introspection: 'none',
        dimensions: [
            {
                kind: 'time',
                name: 'time',
                title: 'Time',
                formula: '$time'
            },
            {
                kind: 'string',
                name: 'twitterHandle',
                title: 'Twitter Handle',
                formula: '$twitterHandle'
            }
        ],
        measures: [
            {
                name: 'count',
                title: 'count',
                formula: '$main.count()'
            }
        ],
        timeAttribute: 'time',
        defaultTimezone: 'Etc/UTC',
        defaultFilter: { op: 'literal', value: true },
        defaultSplits: 'time',
        defaultDuration: 'P3D',
        defaultSortMeasure: 'count',
        defaultPinnedDimensions: ['twitterHandle'],
        refreshRule: {
            rule: "fixed",
            time: new Date('2015-09-13T00:00:00Z')
        }
    };
    var dataCube = data_cube_1.DataCube.fromJS(dataCubeJS);
    var context = { dataCube: dataCube, visualizations: index_1.MANIFESTS };
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(essence_1.Essence, [
            {
                visualization: 'totals',
                timezone: 'Etc/UTC',
                filter: {
                    op: "literal",
                    value: true
                },
                pinnedDimensions: [],
                singleMeasure: 'count',
                selectedMeasures: [],
                splits: []
            },
            {
                visualization: 'totals',
                timezone: 'Etc/UTC',
                filter: plywood_1.$('twitterHandle').overlap(['A', 'B', 'C']).toJS(),
                pinnedDimensions: ['twitterHandle'],
                singleMeasure: 'count',
                selectedMeasures: ['count'],
                splits: []
            }
        ], { context: context });
    });
    describe('errors', function () {
        it('must have context', function () {
            chai_1.expect(function () {
                essence_1.Essence.fromJS({});
            }).to.throw('must have context');
        });
    });
    describe('upgrades', function () {
        it('works in the base case', function () {
            var essence = essence_1.Essence.fromJS({
                visualization: 'totals',
                timezone: 'Etc/UTC',
                pinnedDimensions: [],
                selectedMeasures: [],
                splits: []
            }, context);
            chai_1.expect(essence.toJS()).to.deep.equal({
                "filter": {
                    "action": {
                        "action": "in",
                        "expression": {
                            "action": {
                                "action": "timeRange",
                                "duration": "P3D",
                                "step": -1
                            },
                            "expression": {
                                "name": "m",
                                "op": "ref"
                            },
                            "op": "chain"
                        }
                    },
                    "expression": {
                        "name": "time",
                        "op": "ref"
                    },
                    "op": "chain"
                },
                "multiMeasureMode": true,
                "pinnedDimensions": [],
                "singleMeasure": "count",
                "selectedMeasures": [],
                "splits": [],
                "timezone": "Etc/UTC",
                "visualization": "totals"
            });
        });
        it('adds timezone', function () {
            var linkItem = essence_1.Essence.fromJS({
                visualization: 'totals',
                pinnedDimensions: ['statusCode'],
                selectedMeasures: ['count'],
                splits: [],
                filter: 'true'
            }, context);
            chai_1.expect(linkItem.toJS()).to.deep.equal({
                "filter": {
                    "op": "literal",
                    "value": true
                },
                "multiMeasureMode": true,
                "pinnedDimensions": [],
                "singleMeasure": "count",
                "selectedMeasures": [
                    "count"
                ],
                "splits": [],
                "timezone": "Etc/UTC",
                "visualization": "totals"
            });
        });
        it('handles time series', function () {
            var hashNoVis = "2/EQUQLgxg9AqgKgYWAGgN7APYAdgC5gA2AlmAKYBOAhgSsAG7UCupeY5zAvsgNoC6ybZsmAQMjAHZgU3EWMnB+MsAHcSZcgAlK4gCYEW/cYwIEgA=";
            var timeSeriesHash = "time-series/" + hashNoVis;
            var lineChartHash = "line-chart/" + hashNoVis;
            var barChartHash = "bar-chart/" + hashNoVis;
            var timeSeries = essence_1.Essence.fromHash(timeSeriesHash, context);
            var lineChart = essence_1.Essence.fromHash(lineChartHash, context);
            var barChart = essence_1.Essence.fromHash(barChartHash, context);
            chai_1.expect(timeSeries.visualization).to.equal(lineChart.visualization);
            chai_1.expect(timeSeries.visualization).to.not.equal(barChart.visualization);
        });
    });
    describe('.fromDataCube', function () {
        it('works in the base case', function () {
            var essence = essence_1.Essence.fromDataCube(dataCube, context);
            chai_1.expect(essence.toJS()).to.deep.equal({
                "filter": {
                    "action": {
                        "action": "in",
                        "expression": {
                            "action": {
                                "action": "timeRange",
                                "duration": "P3D",
                                "step": -1
                            },
                            "expression": {
                                "name": "m",
                                "op": "ref"
                            },
                            "op": "chain"
                        }
                    },
                    "expression": {
                        "name": "time",
                        "op": "ref"
                    },
                    "op": "chain"
                },
                "pinnedDimensions": [
                    "twitterHandle"
                ],
                "singleMeasure": "count",
                "selectedMeasures": [
                    "count"
                ],
                "splits": [
                    {
                        "bucketAction": {
                            "action": "timeBucket",
                            "duration": "PT1H"
                        },
                        "expression": {
                            "name": "time",
                            "op": "ref"
                        },
                        "sortAction": {
                            "action": "sort",
                            "direction": "ascending",
                            "expression": {
                                "name": "time",
                                "op": "ref"
                            }
                        }
                    }
                ],
                "timezone": "Etc/UTC",
                "visualization": "line-chart"
            });
        });
    });
    describe('.toHash / #fromHash', function () {
        it("is symmetric", function () {
            var essence1 = essence_1.Essence.fromJS({
                visualization: 'totals',
                timezone: 'Etc/UTC',
                filter: {
                    op: "literal",
                    value: true
                },
                pinnedDimensions: ['twitterHandle'],
                selectedMeasures: ['count'],
                splits: []
            }, context);
            var hash = essence1.toHash();
            var essence2 = essence_1.Essence.fromHash(hash, context);
            chai_1.expect(essence1.toJS()).to.deep.equal(essence2.toJS());
        });
    });
    describe('vis picking', function () {
        describe("#getBestVisualization", function () {
            it("#getBestVisualization", function () {
                var dimensions = data_cube_mock_1.DataCubeMock.twitter().dimensions;
                var vis1 = essence_1.Essence.getBestVisualization(index_1.MANIFESTS, data_cube_mock_1.DataCubeMock.twitter(), splits_1.Splits.EMPTY, null, null);
                chai_1.expect(vis1.visualization.name).to.deep.equal("totals");
                var vis2 = essence_1.Essence.getBestVisualization(index_1.MANIFESTS, data_cube_mock_1.DataCubeMock.twitter(), splits_1.Splits.fromJS(['tweetLength'], { dimensions: dimensions }), null, totals_1.TOTALS_MANIFEST);
                chai_1.expect(vis2.visualization.name).to.deep.equal("bar-chart");
                var vis3 = essence_1.Essence.getBestVisualization(index_1.MANIFESTS, data_cube_mock_1.DataCubeMock.twitter(), splits_1.Splits.fromJS(['time'], { dimensions: dimensions }), null, bar_chart_1.BAR_CHART_MANIFEST);
                chai_1.expect(vis3.visualization.name).to.deep.equal("line-chart");
            });
        });
        describe("#changeSplits", function () {
            var essence = null;
            beforeEach(function () {
                essence = essence_1.Essence.fromJS({
                    visualization: null,
                    timezone: 'Etc/UTC',
                    pinnedDimensions: [],
                    selectedMeasures: [],
                    splits: []
                }, {
                    dataCube: data_cube_mock_1.DataCubeMock.twitter(),
                    visualizations: index_1.MANIFESTS
                });
            });
            var timeSplit = split_combine_1.SplitCombine.fromJS({ expression: { op: 'ref', name: 'time' } });
            var tweetLengthSplit = split_combine_1.SplitCombine.fromJS({ expression: { op: 'ref', name: 'tweetLength' } });
            var twitterHandleSplit = split_combine_1.SplitCombine.fromJS({ expression: { op: 'ref', name: 'twitterHandle' } });
            it("defaults to bar chart with numeric dimension and is sorted on self", function () {
                essence = essence.addSplit(tweetLengthSplit, essence_1.VisStrategy.FairGame);
                chai_1.expect(essence.visualization.name).to.deep.equal("bar-chart");
                chai_1.expect(essence.splits.get(0).sortAction.expression.name).to.deep.equal('tweetLength');
                chai_1.expect(essence.visResolve.state).to.deep.equal("ready");
            });
            it("defaults to line chart with a time split", function () {
                essence = essence.changeSplit(timeSplit, essence_1.VisStrategy.FairGame);
                chai_1.expect(essence.visualization.name).to.deep.equal("line-chart");
                chai_1.expect(essence.visResolve.state).to.deep.equal("ready");
            });
            it("fall back with no splits", function () {
                essence = essence.changeVisualization(bar_chart_1.BAR_CHART_MANIFEST);
                chai_1.expect(essence.visualization.name).to.deep.equal("bar-chart");
                chai_1.expect(essence.visResolve.state).to.deep.equal("manual");
            });
            it("in fair game, adding a string split to time split results in line chart", function () {
                essence = essence.addSplit(timeSplit, essence_1.VisStrategy.FairGame);
                essence = essence.addSplit(twitterHandleSplit, essence_1.VisStrategy.FairGame);
                chai_1.expect(essence.visualization.name).to.deep.equal("line-chart");
                chai_1.expect(essence.visResolve.state).to.deep.equal("ready");
            });
            it("gives existing vis a bonus", function () {
                essence = essence.addSplit(timeSplit, essence_1.VisStrategy.FairGame);
                essence = essence.changeVisualization(bar_chart_1.BAR_CHART_MANIFEST);
                chai_1.expect(essence.visualization.name).to.deep.equal("bar-chart");
                chai_1.expect(essence.visResolve.state).to.deep.equal("ready");
                essence = essence.addSplit(twitterHandleSplit, essence_1.VisStrategy.UnfairGame);
                chai_1.expect(essence.visualization.name).to.deep.equal("bar-chart");
                chai_1.expect(essence.visResolve.state).to.deep.equal("ready");
            });
            it("falls back when can't handle measures", function () {
            });
        });
    });
});
