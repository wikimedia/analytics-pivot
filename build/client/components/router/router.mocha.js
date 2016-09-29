"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var index_1 = require('../../utils/test-utils/index');
var chai_1 = require('chai');
var sinon = require('sinon');
var React = require('react');
var ReactDOM = require('react-dom');
var router_1 = require('./router');
var Fake = (function (_super) {
    __extends(Fake, _super);
    function Fake() {
        _super.call(this);
    }
    Fake.prototype.render = function () {
        var _a = this.props, itemId = _a.itemId, action = _a.action, object = _a.object;
        var str = "" + (action || '') + (itemId || '') + (object && object.label || '');
        return React.createElement("div", {className: "fakey-fakey"}, str);
    };
    return Fake;
}(React.Component));
describe('Router', function () {
    var children;
    var component;
    var node;
    var updateHash;
    var isActiveRoute;
    var findNodes = function (element) {
        var wrapper = index_1.findDOMNode(element);
        if (wrapper.className !== 'route-wrapper') {
            throw new Error('Wrapper should have the proper class name, found ' + wrapper.className + ' instead');
        }
        return wrapper.childNodes;
    };
    var findNode = function (element) {
        var children = findNodes(element);
        if (children.length !== 1) {
            throw new Error('Looking for exactly one node, found ' + children.length + ' instead.');
        }
        return children[0];
    };
    beforeEach(function () {
        updateHash = function (newHash) {
            window.location.hash = newHash;
            var spy = sinon.spy();
            component = ReactDOM.render(React.createElement(router_1.Router, {rootFragment: "root", onURLChange: spy}, children.map(function (c, i) { return React.cloneElement(c, { key: i }); })), node);
        };
        isActiveRoute = function (route) {
            chai_1.expect(window.location.hash, 'window.location.hash should be').to.equal(route);
        };
    });
    describe('with variables only', function () {
        beforeEach(function () {
            node = window.document.createElement('div');
            children = [
                React.createElement(router_1.Route, {fragment: ":itemId", alwaysShowOrphans: true}, 
                    React.createElement("div", {className: "pouet-class"}, "baz"), 
                    " // Should alway be visible", 
                    React.createElement(router_1.Route, {transmit: ['itemId'], fragment: ":action"}, 
                        React.createElement(Fake, null)
                    ))
            ];
            updateHash('root/bar');
        });
        it('works with variables in the hash', function () {
            updateHash('#root/flu/bli');
            var domNodes = findNodes(component);
            var getChild = function (i) { return domNodes[i]; };
            chai_1.expect(getChild(0).className, 'should contain class').to.equal('pouet-class');
            chai_1.expect(getChild(1).className, 'should contain class').to.equal('fakey-fakey');
            chai_1.expect(getChild(1).innerHTML).to.equal('bliflu');
            isActiveRoute('#root/flu/bli');
        });
    });
    describe('with inflatable variables', function () {
        beforeEach(function () {
            node = window.document.createElement('div');
            var pump = function (key, value) {
                if (key === 'action')
                    return { key: key, value: value };
                return { key: 'object', value: { label: value.toUpperCase() } };
            };
            children = [
                React.createElement(router_1.Route, {fragment: ":itemId", alwaysShowOrphans: true}, 
                    React.createElement("div", {className: "pouet-class"}, "baz"), 
                    " // Should alway be visible", 
                    React.createElement(router_1.Route, {transmit: ['itemId'], fragment: ":action", inflate: pump}, 
                        React.createElement(Fake, null)
                    ))
            ];
            updateHash('root/bar');
        });
        it('inflates stuff on the fly', function () {
            updateHash('#root/flu/bli');
            var domNodes = findNodes(component);
            var getChild = function (i) { return domNodes[i]; };
            chai_1.expect(getChild(0).className, 'should contain class').to.equal('pouet-class');
            chai_1.expect(getChild(1).className, 'should contain class').to.equal('fakey-fakey');
            chai_1.expect(getChild(1).innerHTML).to.equal('bliFLU');
            isActiveRoute('#root/flu/bli');
        });
    });
    describe('with initial location', function () {
        beforeEach(function () {
            node = window.document.createElement('div');
            children = [
                React.createElement(router_1.Route, {fragment: "foo"}, 
                    React.createElement("div", {className: "foo-class"}, "foo"), 
                    React.createElement(router_1.Route, {fragment: "foo-0"}, 
                        React.createElement("div", {className: "foo-0-class"}, "foo-0")
                    ), 
                    React.createElement(router_1.Route, {fragment: "foo-1"}, 
                        React.createElement("div", {className: "foo-1-class"}, "foo-1")
                    )),
                React.createElement(router_1.Route, {fragment: "bar"}, 
                    React.createElement("div", {className: "bar-class"}, "bar")
                ),
                React.createElement(router_1.Route, {fragment: "baz"}, 
                    React.createElement("div", {className: "baz-class"}, "baz"), 
                    React.createElement(router_1.Route, {fragment: ":itemId"}, 
                        React.createElement(Fake, null)
                    ), 
                    " // Fake is gonna get passed whatever replaces :bazId in the hash"),
                React.createElement(router_1.Route, {fragment: "qux"}, 
                    React.createElement("div", {className: "qux-class"}, "qux"), 
                    React.createElement(router_1.Route, {fragment: ":itemId/:action=edit"}, 
                        React.createElement(Fake, null)
                    ), 
                    " // default value for variable")
            ];
            updateHash('root/bar');
        });
        it('initializes to the location', function (done) {
            setTimeout(function () {
                chai_1.expect(findNode(component).className, 'should contain class').to.equal('bar-class');
                isActiveRoute('#root/bar');
                done();
            }, 2);
        });
        it('fixes multiple slashes', function () {
            updateHash('#root//foo/foo-1///');
            isActiveRoute('#root/foo/foo-1');
            var domNode = findNode(component);
            chai_1.expect(domNode.className, 'should contain class').to.equal('foo-1-class');
            chai_1.expect(domNode.innerHTML).to.equal('foo-1');
        });
        it('fixes wrong fragment and defaults to first route', function () {
            updateHash('#root/ABLAB');
            isActiveRoute('#root/foo');
            var domNode = findNode(component);
            chai_1.expect(domNode.className, 'should contain class').to.equal('foo-class');
            chai_1.expect(domNode.innerHTML).to.equal('foo');
        });
        it('strips extra fragments', function () {
            updateHash('#root/bar/UNNECESSARY');
            isActiveRoute('#root/bar');
            updateHash('#root/baz/pouet/UNNECESSARY');
            var domNode = findNode(component);
            isActiveRoute('#root/baz/pouet');
            chai_1.expect(domNode.className, 'should contain class').to.equal('fakey-fakey');
            chai_1.expect(domNode.innerHTML).to.equal('pouet');
        });
        it('follows the window.location.hash\'s changes', function () {
            updateHash('#root/baz');
            chai_1.expect(findNode(component).className, 'should contain class').to.equal('baz-class');
            isActiveRoute('#root/baz');
        });
        it('works with variables in the hash', function () {
            updateHash('#root/baz/pouet');
            var domNode = findNode(component);
            chai_1.expect(domNode.className, 'should contain class').to.equal('fakey-fakey');
            chai_1.expect(domNode.innerHTML).to.equal('pouet');
            isActiveRoute('#root/baz/pouet');
        });
        it('recognizes default for a variable', function () {
            updateHash('#root/qux/myItem');
            var domNode = findNode(component);
            chai_1.expect(domNode.className, 'should contain class').to.equal('fakey-fakey');
            chai_1.expect(domNode.innerHTML).to.equal('editmyItem');
            isActiveRoute('#root/qux/myItem/edit');
        });
    });
    describe('without initial location', function () {
        beforeEach(function () {
            node = window.document.createElement('div');
            children = [
                React.createElement(router_1.Route, {fragment: "foo"}, 
                    React.createElement("div", {className: "foo-class"}, "foo")
                ),
                React.createElement(router_1.Route, {fragment: "bar"}, 
                    React.createElement("div", {className: "bar-class"}, "bar")
                ),
                React.createElement(router_1.Route, {fragment: "baz"}, 
                    React.createElement("div", {className: "baz-class"}, "baz")
                )
            ];
            updateHash('root');
        });
        it('defaults to the first route', function (done) {
            setTimeout(function () {
                isActiveRoute('#root/foo');
                done();
            }, 2);
        });
        it('follows the window.location.hash\'s changes', function () {
            updateHash('#root/baz');
            chai_1.expect(findNode(component).className, 'should contain class').to.equal('baz-class');
            isActiveRoute('#root/baz');
        });
    });
});
