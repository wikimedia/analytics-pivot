"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./immutable-dropdown.css');
var index_1 = require('../../../common/utils/index');
var React = require('react');
var dropdown_1 = require('../dropdown/dropdown');
var ImmutableDropdown = (function (_super) {
    __extends(ImmutableDropdown, _super);
    function ImmutableDropdown() {
        _super.call(this);
    }
    ImmutableDropdown.specialize = function () {
        return ImmutableDropdown;
    };
    ImmutableDropdown.simpleGenerator = function (instance, changeFn) {
        return function (name, items) {
            var MyDropDown = ImmutableDropdown.specialize();
            return React.createElement(MyDropDown, {items: items, instance: instance, path: name, equal: function (a, b) { return a.value === b.value; }, renderItem: function (a) { return a ? a.label : ''; }, keyItem: function (a) { return a.value || 'default_value'; }, onChange: changeFn});
        };
    };
    ImmutableDropdown.prototype.onChange = function (newSelectedItem) {
        var _a = this.props, instance = _a.instance, path = _a.path, onChange = _a.onChange, keyItem = _a.keyItem;
        onChange(index_1.ImmutableUtils.setProperty(instance, path, keyItem(newSelectedItem)), true, path, undefined);
    };
    ImmutableDropdown.prototype.render = function () {
        var _a = this.props, label = _a.label, items = _a.items, equal = _a.equal, renderItem = _a.renderItem, keyItem = _a.keyItem, instance = _a.instance, path = _a.path;
        var MyDropDown = dropdown_1.Dropdown.specialize();
        var selectedValue = index_1.ImmutableUtils.getProperty(instance, path);
        var selectedItem = items.filter(function (item) { return keyItem(item) === selectedValue; })[0] || items[0];
        return React.createElement(MyDropDown, {className: "immutable-dropdown input", label: label, items: items, selectedItem: selectedItem, equal: equal, renderItem: renderItem, keyItem: keyItem, onSelect: this.onChange.bind(this)});
    };
    return ImmutableDropdown;
}(React.Component));
exports.ImmutableDropdown = ImmutableDropdown;
