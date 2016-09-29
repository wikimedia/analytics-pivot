"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var string_1 = require('../../../common/utils/string/string');
var dom_1 = require('../../utils/dom/dom');
var GlobalEventListener = (function (_super) {
    __extends(GlobalEventListener, _super);
    function GlobalEventListener() {
        _super.call(this);
        this.propsToEvents = {
            resize: 'resize',
            scroll: 'scroll',
            mouseDown: 'mousedown',
            mouseMove: 'mousemove',
            mouseUp: 'mouseup',
            keyDown: 'keydown',
            enter: 'keydown',
            escape: 'keydown',
            right: 'keydown',
            left: 'keydown'
        };
        this.onResize = this.onResize.bind(this);
        this.onMousemove = this.onMousemove.bind(this);
        this.onMouseup = this.onMouseup.bind(this);
        this.onMousedown = this.onMousedown.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }
    GlobalEventListener.prototype.componentWillReceiveProps = function (nextProps) {
        this.refreshListeners(nextProps, this.props);
    };
    GlobalEventListener.prototype.componentDidMount = function () {
        this.refreshListeners(this.props);
    };
    GlobalEventListener.prototype.componentWillUnmount = function () {
        for (var prop in this.propsToEvents) {
            this.removeListener(this.propsToEvents[prop]);
        }
    };
    GlobalEventListener.prototype.refreshListeners = function (nextProps, currentProps) {
        if (currentProps === void 0) { currentProps = {}; }
        var toAdd = [];
        var toRemove = [];
        for (var prop in this.propsToEvents) {
            var event_1 = this.propsToEvents[prop];
            if (currentProps[prop] && nextProps[prop])
                continue;
            if (nextProps[prop] && toAdd.indexOf(event_1) === -1) {
                toAdd.push(event_1);
            }
            else if (currentProps[prop] && toRemove.indexOf(event_1) === -1) {
                toRemove.push(event_1);
            }
        }
        toRemove.forEach(this.removeListener, this);
        toAdd.forEach(this.addListener, this);
    };
    GlobalEventListener.prototype.addListener = function (event) {
        var useCapture = event === 'scroll';
        window.addEventListener(event, this[("on" + string_1.firstUp(event))], useCapture);
    };
    GlobalEventListener.prototype.removeListener = function (event) {
        window.removeEventListener(event, this[("on" + string_1.firstUp(event))]);
    };
    GlobalEventListener.prototype.onResize = function () {
        if (this.props.resize)
            this.props.resize();
    };
    GlobalEventListener.prototype.onScroll = function () {
        if (this.props.scroll)
            this.props.scroll();
    };
    GlobalEventListener.prototype.onMousedown = function (e) {
        if (this.props.mouseDown)
            this.props.mouseDown(e);
    };
    GlobalEventListener.prototype.onMousemove = function (e) {
        if (this.props.mouseMove)
            this.props.mouseMove(e);
    };
    GlobalEventListener.prototype.onMouseup = function (e) {
        if (this.props.mouseUp)
            this.props.mouseUp(e);
    };
    GlobalEventListener.prototype.onKeydown = function (e) {
        if (this.props.escape && dom_1.escapeKey(e))
            this.props.escape(e);
        if (this.props.enter && dom_1.enterKey(e))
            this.props.enter(e);
        if (this.props.right && dom_1.rightKey(e))
            this.props.right(e);
        if (this.props.left && dom_1.leftKey(e))
            this.props.left(e);
        if (this.props.keyDown)
            this.props.keyDown(e);
    };
    GlobalEventListener.prototype.render = function () {
        return null;
    };
    return GlobalEventListener;
}(React.Component));
exports.GlobalEventListener = GlobalEventListener;
