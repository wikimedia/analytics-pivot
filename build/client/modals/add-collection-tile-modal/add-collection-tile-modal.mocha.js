"use strict";
var chai_1 = require('chai');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var index_1 = require('../../utils/test-utils/index');
var mocks_1 = require('../../../common/models/mocks');
var add_collection_tile_modal_1 = require('./add-collection-tile-modal');
describe.skip('AddCollectionTileModal', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(add_collection_tile_modal_1.AddCollectionTileModal, {essence: null, timekeeper: mocks_1.TimekeeperMock.fixed(), dataCube: null, collection: null}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(index_1.findDOMNode(renderedComponent).className, 'should contain class').to.contain('add-collection-tile-modal');
    });
});
