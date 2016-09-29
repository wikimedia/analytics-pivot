"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
require('../../utils/test-utils/index');
var TestUtils = require('react-addons-test-utils');
var mocks_1 = require('../../../common/models/mocks');
var link_view_1 = require('./link-view');
describe('LinkView', function () {
    it.skip('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(link_view_1.LinkView, {timekeeper: mocks_1.TimekeeperMock.fixed(), collection: null, hash: null, updateViewHash: null, changeHash: null, stateful: true}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('link-view');
    });
});
