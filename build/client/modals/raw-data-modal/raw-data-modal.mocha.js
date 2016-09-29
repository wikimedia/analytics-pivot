"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
require('../../utils/test-utils/index');
var mocks_1 = require('../../../common/models/mocks');
var raw_data_modal_1 = require('./raw-data-modal');
describe.skip('RawDataModal', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(raw_data_modal_1.RawDataModal, {onClose: null, essence: null, timekeeper: mocks_1.TimekeeperMock.fixed()}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('raw-data-modal');
    });
});
