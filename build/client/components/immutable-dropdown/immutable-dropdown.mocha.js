"use strict";
var chai_1 = require('chai');
var sinon = require('sinon');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var mocks_1 = require('../../../common/models/mocks');
var index_1 = require('../../../common/models/index');
var index_2 = require('../../utils/test-utils/index');
var immutable_dropdown_1 = require('./immutable-dropdown');
describe('ImmutableDropdown', function () {
    var component;
    var node;
    var onChange;
    beforeEach(function () {
        onChange = sinon.spy();
        var MyDropdown = immutable_dropdown_1.ImmutableDropdown.specialize();
        var clusterNames = index_1.Cluster.TYPE_VALUES.map(function (type) { return { value: type, label: type }; });
        component = TestUtils.renderIntoDocument(React.createElement(MyDropdown, {instance: mocks_1.DataCubeMock.twitter(), path: 'clusterName', label: "Cluster", onChange: onChange, items: clusterNames, equal: function (a, b) { return a.value === b.value; }, renderItem: function (a) { return a.label; }, keyItem: function (a) { return a.value; }}));
        node = index_2.findDOMNode(component);
    });
    it('adds the correct class', function () {
        chai_1.expect(TestUtils.isCompositeComponent(component), 'should be composite').to.equal(true);
        chai_1.expect(node.className, 'should contain class').to.contain('immutable-dropdown');
    });
    it('selects an item and calls onChange', function () {
        chai_1.expect(onChange.callCount).to.equal(0);
        TestUtils.Simulate.click(node);
        var items = TestUtils.scryRenderedDOMComponentsWithClass(component, 'dropdown-item');
        TestUtils.Simulate.click(items[1]);
        chai_1.expect(onChange.callCount).to.equal(1);
        var args = onChange.args[0];
        chai_1.expect(args[0]).to.be.instanceOf(index_1.DataCube);
        chai_1.expect(args[0].clusterName).to.equal(index_1.Cluster.TYPE_VALUES[1]);
        chai_1.expect(args[1]).to.equal(true);
        chai_1.expect(args[2]).to.equal('clusterName');
    });
});
