"use strict";
var chai_1 = require('chai');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var mocks_1 = require('../../../common/models/mocks');
var index_1 = require('../../utils/test-utils/index');
var number_filter_menu_1 = require('./number-filter-menu');
describe('NumberFilterMenu', function () {
    var div = document.createElement('div');
    div.setAttribute("id", "Div1");
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(number_filter_menu_1.NumberFilterMenu, {clicker: null, dimension: mocks_1.DimensionMock.time(), essence: mocks_1.EssenceMock.wikiTotals(), timekeeper: mocks_1.TimekeeperMock.fixed(), onClose: null, containerStage: mocks_1.StageMock.defaultA(), openOn: div, inside: div}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(index_1.findDOMNode(renderedComponent).className, 'should contain class').to.contain('number-filter-menu');
    });
});
