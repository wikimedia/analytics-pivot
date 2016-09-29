"use strict";
var chai_1 = require('chai');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var mocks_1 = require('../../../../common/models/mocks');
var index_1 = require('../../../utils/test-utils/index');
var collection_header_bar_1 = require('./collection-header-bar');
describe('CollectionHeaderBar', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(collection_header_bar_1.CollectionHeaderBar, {dataCubes: [mocks_1.DataCubeMock.twitter()], collections: [], onAddItem: null, onNavClick: null}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(index_1.findDOMNode(renderedComponent).className, 'should contain class').to.contain('collection-header-bar');
    });
});
