"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
require('../../../utils/test-utils/index');
var settings_header_bar_1 = require('./settings-header-bar');
describe('SettingsHeaderBar', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(settings_header_bar_1.SettingsHeaderBar, {onNavClick: null}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('settings-header-bar');
    });
});
