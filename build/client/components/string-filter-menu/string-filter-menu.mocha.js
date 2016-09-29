"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
require('../../utils/test-utils/index');
var mocks_1 = require('../../../common/models/mocks');
var string_filter_menu_1 = require('./string-filter-menu');
describe.skip('StringFilterMenu', function () {
    it('adds the correct class', function () {
        var div = document.createElement('div');
        div.setAttribute("id", "Div1");
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(string_filter_menu_1.StringFilterMenu, {clicker: null, dimension: mocks_1.DimensionMock.countryURL(), essence: mocks_1.EssenceMock.wikiLineChart(), timekeeper: mocks_1.TimekeeperMock.fixed(), onClose: null, containerStage: mocks_1.StageMock.defaultA(), openOn: div, inside: div, changePosition: null}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('string-filter-menu');
    });
});
