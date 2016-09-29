"use strict";
var immutable_class_tester_1 = require('immutable-class-tester');
var collection_mock_1 = require('./collection.mock');
var collection_1 = require('./collection');
describe('Collection', function () {
    var context = collection_mock_1.CollectionMock.getContext();
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(collection_1.Collection, [
            collection_mock_1.CollectionMock.testOneOnlyJS(),
            collection_mock_1.CollectionMock.testOneTwoJS()
        ], { context: context });
    });
});
