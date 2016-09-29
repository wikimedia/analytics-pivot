"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./simple-list.css');
var React = require('react');
var dom_1 = require('../../utils/dom/dom');
var svg_icon_1 = require('../svg-icon/svg-icon');
var SimpleList = (function (_super) {
    __extends(SimpleList, _super);
    function SimpleList() {
        _super.call(this);
        this.state = { dropIndex: -1 };
    }
    SimpleList.prototype.dragStart = function (item, e) {
        this.setState({ draggedItem: item });
        var dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData("text/html", item.title);
        dom_1.setDragGhost(dataTransfer, item.title);
    };
    SimpleList.prototype.isInTopHalf = function (e) {
        var targetRect = e.currentTarget.getBoundingClientRect();
        return dom_1.getYFromEvent(e) - targetRect.top <= targetRect.height / 2;
    };
    SimpleList.prototype.dragOver = function (item, e) {
        e.preventDefault();
        var _a = this.state, draggedItem = _a.draggedItem, dropIndex = _a.dropIndex;
        var rows = this.props.rows;
        if (dropIndex === -1 && item === draggedItem)
            return;
        var sourceIndex = rows.indexOf(draggedItem);
        var targetIndex = rows.indexOf(item);
        var newDropIndex = this.isInTopHalf(e) ? targetIndex : targetIndex + 1;
        if (newDropIndex === sourceIndex || newDropIndex === sourceIndex + 1) {
            this.setState({
                dropIndex: -1
            });
        }
        else if (newDropIndex !== dropIndex) {
            this.setState({
                dropIndex: newDropIndex
            });
        }
    };
    SimpleList.prototype.dragEnd = function (e) {
        var _a = this.props, rows = _a.rows, onReorder = _a.onReorder;
        var _b = this.state, draggedItem = _b.draggedItem, dropIndex = _b.dropIndex;
        if (dropIndex > -1)
            onReorder(rows.indexOf(draggedItem), dropIndex);
        this.setState({
            draggedItem: undefined,
            dropIndex: -1
        });
    };
    SimpleList.prototype.renderRows = function (rows) {
        var _this = this;
        if (!rows || !rows.length)
            return [];
        var _a = this.props, onEdit = _a.onEdit, onRemove = _a.onRemove, onReorder = _a.onReorder;
        var _b = this.state, draggedItem = _b.draggedItem, dropIndex = _b.dropIndex;
        var svgize = function (iconName) { return iconName ? React.createElement(svg_icon_1.SvgIcon, {svg: require("../../icons/" + iconName + ".svg")}) : null; };
        return rows.map(function (row, i) {
            var title = row.title, description = row.description, icon = row.icon;
            var dragHandle = React.createElement("div", {className: "drag-handle"}, 
                React.createElement(svg_icon_1.SvgIcon, {svg: require('../../icons/dragger.svg')})
            );
            var svg = svgize(icon);
            var text = React.createElement("div", {className: "text"}, 
                React.createElement("div", {className: "title"}, title), 
                React.createElement("div", {className: "description"}, description));
            var actions = React.createElement("div", {className: "actions"}, 
                React.createElement("button", {onClick: onEdit.bind(_this, i)}, svgize('full-edit')), 
                React.createElement("button", {onClick: onRemove.bind(_this, i)}, svgize('full-remove')));
            var isBeingDragged = draggedItem === row;
            var classes = dom_1.classNames('row', {
                'drop-before': dropIndex === i,
                'drop-after': i === rows.length - 1 && dropIndex === i + 1,
                'dragged': isBeingDragged
            });
            return React.createElement("div", {className: classes, key: "row-" + i, onDragOver: _this.dragOver.bind(_this, row), draggable: !!onReorder, onDragStart: _this.dragStart.bind(_this, row)}, 
                onReorder ? dragHandle : null, 
                svg, 
                text, 
                actions);
        });
    };
    SimpleList.prototype.render = function () {
        return React.createElement("div", {className: "simple-list", ref: "list", onDragEnd: this.dragEnd.bind(this)}, this.renderRows(this.props.rows));
    };
    return SimpleList;
}(React.Component));
exports.SimpleList = SimpleList;
