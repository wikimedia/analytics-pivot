"use strict";
var chai_1 = require('chai');
var immutable_class_tester_1 = require('immutable-class-tester');
var collection_tile_mock_1 = require('./collection-tile.mock');
var collection_tile_1 = require('./collection-tile');
describe('CollectionTile', function () {
    var context = collection_tile_mock_1.CollectionTileMock.getContext();
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(collection_tile_1.CollectionTile, [
            collection_tile_mock_1.CollectionTileMock.testOneJS(),
            collection_tile_mock_1.CollectionTileMock.testTwoJS()
        ], { context: context });
    });
    describe('errors', function () {
        it('must have context', function () {
            chai_1.expect(function () {
                collection_tile_1.CollectionTile.fromJS({});
            }).to.throw('must have context');
        });
    });
    describe('upgrades', function () {
        it('must add filter and timezone', function () {
            var linkItem = collection_tile_1.CollectionTile.fromJS({
                name: 'test1',
                title: 'Test One',
                description: 'I like testing',
                group: 'Tests',
                dataCube: 'wiki',
                essence: {
                    visualization: 'line-chart',
                    pinnedDimensions: ['articleName'],
                    singleMeasure: "count",
                    selectedMeasures: ['count'],
                    splits: 'time'
                }
            }, context);
            chai_1.expect(linkItem.toJS()).to.deep.equal({
                "dataCube": "wiki",
                "description": "I like testing",
                "essence": {
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
                        "articleName"
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
                },
                "group": "Tests",
                "name": "test1",
                "title": "Test One"
            });
        });
    });
});
