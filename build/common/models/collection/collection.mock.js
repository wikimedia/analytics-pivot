"use strict";
var collection_tile_mock_1 = require("../collection-tile/collection-tile.mock");
var collection_1 = require('./collection');
var CollectionMock = (function () {
    function CollectionMock() {
    }
    CollectionMock.testOneOnlyJS = function () {
        return {
            title: 'The Links Will Rise Again!',
            name: 'the_links_will_rise_again',
            tiles: [
                collection_tile_mock_1.CollectionTileMock.testOneJS()
            ]
        };
    };
    CollectionMock.testOneTwoJS = function () {
        return {
            title: 'The Links Will Be Reloaded!',
            name: 'the_links_will_be_reloaded',
            tiles: [
                collection_tile_mock_1.CollectionTileMock.testOneJS(),
                collection_tile_mock_1.CollectionTileMock.testTwoJS()
            ]
        };
    };
    CollectionMock.getContext = function () {
        return collection_tile_mock_1.CollectionTileMock.getContext();
    };
    CollectionMock.testOneOnly = function () {
        return collection_1.Collection.fromJS(CollectionMock.testOneOnlyJS(), CollectionMock.getContext());
    };
    CollectionMock.testOneTwo = function () {
        return collection_1.Collection.fromJS(CollectionMock.testOneTwoJS(), CollectionMock.getContext());
    };
    return CollectionMock;
}());
exports.CollectionMock = CollectionMock;
