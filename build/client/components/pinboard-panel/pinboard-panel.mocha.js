"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
require('../../utils/test-utils/index');
var TestUtils = require('react-addons-test-utils');
var mocks_1 = require('../../../common/models/mocks');
var pinboard_panel_1 = require('./pinboard-panel');
describe.skip('PinboardPanel', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(pinboard_panel_1.PinboardPanel, {clicker: null, essence: null, timekeeper: mocks_1.TimekeeperMock.fixed()}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('pinboard-panel');
    });
});
