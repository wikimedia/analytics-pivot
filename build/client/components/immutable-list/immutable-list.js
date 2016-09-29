"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./immutable-list.css');
var React = require('react');
var simple_list_1 = require('../simple-list/simple-list');
var ImmutableList = (function (_super) {
    __extends(ImmutableList, _super);
    function ImmutableList() {
        _super.call(this);
        this.state = {};
    }
    ImmutableList.specialize = function () {
        return ImmutableList;
    };
    ImmutableList.prototype.editItem = function (index) {
        this.setState({ editedIndex: index });
    };
    ImmutableList.prototype.addItem = function () {
        this.setState({ pendingAddItem: this.props.getNewItem() });
    };
    ImmutableList.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.items) {
            this.setState({ tempItems: nextProps.items });
        }
    };
    ImmutableList.prototype.componentDidMount = function () {
        if (this.props.items) {
            this.setState({ tempItems: this.props.items });
        }
    };
    ImmutableList.prototype.deleteItem = function (index) {
        var tempItems = this.state.tempItems;
        this.setState({ tempItems: tempItems.delete(index) }, this.onChange);
    };
    ImmutableList.prototype.onReorder = function (oldIndex, newIndex) {
        var tempItems = this.state.tempItems;
        var item = tempItems.get(oldIndex);
        this.setState({
            tempItems: tempItems
                .delete(oldIndex)
                .insert(newIndex > oldIndex ? newIndex - 1 : newIndex, item)
        }, this.onChange);
    };
    ImmutableList.prototype.onChange = function () {
        this.props.onChange(this.state.tempItems);
    };
    ImmutableList.prototype.renderEditModal = function (itemIndex) {
        var _this = this;
        var tempItems = this.state.tempItems;
        var item = tempItems.get(itemIndex);
        var onSave = function (newItem) {
            var newItems = tempItems.update(itemIndex, function () { return newItem; });
            _this.setState({ tempItems: newItems, editedIndex: undefined }, _this.onChange);
        };
        var onClose = function () { return _this.setState({ editedIndex: undefined }); };
        return React.cloneElement(this.props.getModal(item), { onSave: onSave, onClose: onClose });
    };
    ImmutableList.prototype.renderAddModal = function (item) {
        var _this = this;
        var onSave = function (newItem) {
            var tempItems = _this.state.tempItems;
            var newItems = tempItems.push(newItem);
            _this.setState({ tempItems: newItems, pendingAddItem: null }, _this.onChange);
        };
        var onClose = function () { return _this.setState({ pendingAddItem: null }); };
        return React.cloneElement(this.props.getModal(item), { onSave: onSave, onClose: onClose });
    };
    ImmutableList.prototype.render = function () {
        var _a = this.props, items = _a.items, getRows = _a.getRows, label = _a.label;
        var _b = this.state, editedIndex = _b.editedIndex, pendingAddItem = _b.pendingAddItem;
        if (!items)
            return null;
        return React.createElement("div", {className: "immutable-list"}, 
            React.createElement("div", {className: "list-title"}, 
                React.createElement("div", {className: "label"}, label), 
                React.createElement("div", {className: "actions"}, 
                    React.createElement("button", {onClick: this.addItem.bind(this)}, "Add item")
                )), 
            React.createElement(simple_list_1.SimpleList, {rows: getRows(items), onEdit: this.editItem.bind(this), onRemove: this.deleteItem.bind(this), onReorder: this.onReorder.bind(this)}), 
            editedIndex !== undefined ? this.renderEditModal(editedIndex) : null, 
            pendingAddItem ? this.renderAddModal(pendingAddItem) : null);
    };
    return ImmutableList;
}(React.Component));
exports.ImmutableList = ImmutableList;
