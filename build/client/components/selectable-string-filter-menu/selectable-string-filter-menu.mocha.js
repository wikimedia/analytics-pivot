"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var filter_1 = require("../../../common/models/filter/filter");
require('../../utils/test-utils/index');
var mocks_1 = require('../../../common/models/mocks');
var selectable_string_filter_menu_1 = require("./selectable-string-filter-menu");
describe.skip('SelectableStringFilterMenu', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(selectable_string_filter_menu_1.SelectableStringFilterMenu, {filterMode: filter_1.Filter.REGEX, searchText: "", onClauseChange: null, clicker: null, dimension: null, essence: null, timekeeper: mocks_1.TimekeeperMock.fixed(), onClose: null}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('string-filter-menu');
    });
});
