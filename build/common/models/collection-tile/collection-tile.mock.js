"use strict";
var plywood_1 = require('plywood');
var index_1 = require("../../manifests/index");
var data_cube_mock_1 = require("../data-cube/data-cube.mock");
var collection_tile_1 = require('./collection-tile');
var CollectionTileMock = (function () {
    function CollectionTileMock() {
    }
    CollectionTileMock.testOneJS = function () {
        return {
            name: 'test1',
            title: 'Test One',
            description: 'I like testing',
            group: 'Tests',
            dataCube: 'wiki',
            essence: {
                visualization: 'totals',
                timezone: 'Etc/UTC',
                filter: {
                    op: "literal",
                    value: true
                },
                pinnedDimensions: ['articleName'],
                singleMeasure: "count",
                selectedMeasures: ['count'],
                splits: []
            }
        };
    };
    CollectionTileMock.testTwoJS = function () {
        return {
            name: 'test2',
            title: 'Test Two',
            description: 'I like testing',
            group: 'Tests',
            dataCube: 'wiki',
            essence: {
                visualization: 'totals',
                timezone: 'Etc/UTC',
                filter: plywood_1.$('time').in(new Date('2015-01-01Z'), new Date('2016-01-01Z')).toJS(),
                pinnedDimensions: [],
                singleMeasure: "count",
                selectedMeasures: ['count'],
                splits: []
            }
        };
    };
    CollectionTileMock.getContext = function () {
        return {
            dataCubes: [data_cube_mock_1.DataCubeMock.wiki()],
            visualizations: index_1.MANIFESTS
        };
    };
    CollectionTileMock.testOne = function () {
        return collection_tile_1.CollectionTile.fromJS(CollectionTileMock.testOneJS(), CollectionTileMock.getContext());
    };
    CollectionTileMock.testTwo = function () {
        return collection_tile_1.CollectionTile.fromJS(CollectionTileMock.testTwoJS(), CollectionTileMock.getContext());
    };
    return CollectionTileMock;
}());
exports.CollectionTileMock = CollectionTileMock;
