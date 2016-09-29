"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
require('../../utils/test-utils/index');
var TestUtils = require('react-addons-test-utils');
var side_drawer_1 = require('./side-drawer');
describe.skip('SideDrawer', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(side_drawer_1.SideDrawer, {user: null, collections: null, dataCubes: null, selectedItem: null, onOpenAbout: null, onClose: null, viewType: "cube"}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('side-drawer');
    });
});
