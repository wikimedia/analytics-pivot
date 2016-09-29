"use strict";
var chai_1 = require('chai');
var sinon = require('sinon');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var index_1 = require('../../../common/models/index');
var mocks_1 = require('../../../common/models/mocks');
var index_2 = require('../../utils/test-utils/index');
var immutable_input_1 = require('./immutable-input');
describe('ImmutableInput', function () {
    var component;
    var node;
    var onChange;
    var onInvalid;
    beforeEach(function () {
        onChange = sinon.spy();
        onInvalid = sinon.spy();
        component = TestUtils.renderIntoDocument(React.createElement(immutable_input_1.ImmutableInput, {instance: mocks_1.DataCubeMock.twitter(), path: 'clusterName', validator: /^.+$/, onChange: onChange, onInvalid: onInvalid}));
        node = index_2.findDOMNode(component);
    });
    it('adds the correct class', function () {
        chai_1.expect(TestUtils.isCompositeComponent(component), 'should be composite').to.equal(true);
        chai_1.expect(node.className, 'should contain class').to.contain('immutable-input');
    });
    it('works for valid values', function () {
        node.value = 'giraffe';
        TestUtils.Simulate.change(node);
        chai_1.expect(onInvalid.callCount).to.equal(0);
        chai_1.expect(onChange.callCount).to.equal(1);
        var args = onChange.args[0];
        chai_1.expect(args[0]).to.be.instanceOf(index_1.DataCube);
        chai_1.expect(args[0].clusterName).to.equal('giraffe');
        chai_1.expect(args[1]).to.equal(true);
        chai_1.expect(args[2]).to.equal('clusterName');
    });
    it('works for invalid values', function () {
        node.value = '';
        TestUtils.Simulate.change(node);
        chai_1.expect(onInvalid.callCount).to.equal(1);
        chai_1.expect(onInvalid.args[0][0]).to.equal('');
        chai_1.expect(onChange.callCount).to.equal(1);
        var args = onChange.args[0];
        chai_1.expect(args[0]).to.be.instanceOf(index_1.DataCube);
        chai_1.expect(args[0].clusterName).to.equal(mocks_1.DataCubeMock.twitter().clusterName);
        chai_1.expect(args[1]).to.equal(false);
        chai_1.expect(args[2]).to.equal('clusterName');
        chai_1.expect(node.value).to.equal('');
        node.value = 'pouet';
        TestUtils.Simulate.change(node);
        chai_1.expect(onInvalid.callCount).to.equal(1);
        chai_1.expect(onChange.callCount).to.equal(2);
        args = onChange.args[1];
        chai_1.expect(args[0]).to.be.instanceOf(index_1.DataCube);
        chai_1.expect(args[0].clusterName).to.equal('pouet');
        chai_1.expect(args[1]).to.equal(true);
        chai_1.expect(args[2]).to.equal('clusterName');
        chai_1.expect(node.value).to.equal('pouet');
    });
    describe('with stringToValue/valueToString', function () {
        beforeEach(function () {
            var stringToValue = function (str) {
                if (str === 'PLATYPUS')
                    throw new Error("It's not even like a real animal amirite");
                return str.toLowerCase();
            };
            var valueToString = function (str) { return str.toUpperCase(); };
            component = TestUtils.renderIntoDocument(React.createElement(immutable_input_1.ImmutableInput, {instance: mocks_1.DataCubeMock.twitter(), path: 'clusterName', validator: /^.+$/, onChange: onChange, onInvalid: onInvalid, stringToValue: stringToValue, valueToString: valueToString}));
            node = index_2.findDOMNode(component);
        });
        it('works for valid values', function () {
            chai_1.expect(node.value).to.equal('DRUID');
            node.value = 'GIRAFFE';
            TestUtils.Simulate.change(node);
            chai_1.expect(onInvalid.callCount).to.equal(0);
            chai_1.expect(onChange.callCount).to.equal(1);
            var args = onChange.args[0];
            chai_1.expect(args[0]).to.be.instanceOf(index_1.DataCube);
            chai_1.expect(args[0].clusterName).to.equal('giraffe');
            chai_1.expect(args[1]).to.equal(true);
            chai_1.expect(args[2]).to.equal('clusterName');
        });
        it('works when an error is thrown', function () {
            chai_1.expect(node.value).to.equal('DRUID');
            node.value = 'PLATYPUS';
            TestUtils.Simulate.change(node);
            chai_1.expect(onInvalid.callCount).to.equal(1);
            chai_1.expect(onInvalid.args[0][0]).to.equal(undefined);
            chai_1.expect(onChange.callCount).to.equal(1);
            var args = onChange.args[0];
            chai_1.expect(args[0]).to.be.instanceOf(index_1.DataCube);
            chai_1.expect(args[0].clusterName).to.equal(mocks_1.DataCubeMock.twitter().clusterName);
            chai_1.expect(args[1]).to.equal(false);
            chai_1.expect(args[2]).to.equal('clusterName');
            chai_1.expect(node.value).to.equal('PLATYPUS');
        });
    });
});
