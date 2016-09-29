"use strict";
var chai_1 = require('chai');
require('../../utils/test-utils/index');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var mocks_1 = require('../../../common/models/mocks');
var table_1 = require('./table');
describe.skip('Table', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(table_1.Table, {clicker: null, essence: null, timekeeper: mocks_1.TimekeeperMock.fixed(), stage: null}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('table');
    });
});
