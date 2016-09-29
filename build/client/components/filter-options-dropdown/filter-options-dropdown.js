"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./filter-options-dropdown.css');
var React = require('react');
var constants_1 = require('../../config/constants');
var index_1 = require('../../../common/models/index');
var dropdown_1 = require("../dropdown/dropdown");
var svg_icon_1 = require('../svg-icon/svg-icon');
var FILTER_OPTIONS = [
    {
        label: constants_1.STRINGS.include,
        value: index_1.Filter.INCLUDED,
        svg: require('../../icons/filter-include.svg'),
        checkType: 'check'
    },
    {
        label: constants_1.STRINGS.exclude,
        value: index_1.Filter.EXCLUDED,
        svg: require('../../icons/filter-exclude.svg'),
        checkType: 'cross'
    },
    {
        label: constants_1.STRINGS.contains,
        value: index_1.Filter.CONTAINS,
        svg: require('../../icons/filter-contains.svg')
    },
    {
        label: constants_1.STRINGS.regex,
        value: index_1.Filter.REGEX,
        svg: require('../../icons/filter-regex.svg')
    }
];
var FilterOptionsDropdown = (function (_super) {
    __extends(FilterOptionsDropdown, _super);
    function FilterOptionsDropdown() {
        _super.call(this);
    }
    FilterOptionsDropdown.getFilterOptions = function () {
        var filterTypes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            filterTypes[_i - 0] = arguments[_i];
        }
        return FILTER_OPTIONS.filter(function (option) { return filterTypes.indexOf(option.value) !== -1; });
    };
    FilterOptionsDropdown.prototype.onSelectOption = function (option) {
        this.props.onSelectOption(option.value);
    };
    FilterOptionsDropdown.prototype.renderFilterOption = function (option) {
        return React.createElement("span", {className: "filter-option"}, 
            React.createElement(svg_icon_1.SvgIcon, {className: "icon", svg: option.svg}), 
            React.createElement("span", {className: "option-label"}, option.label));
    };
    FilterOptionsDropdown.prototype.render = function () {
        var _a = this.props, selectedOption = _a.selectedOption, onSelectOption = _a.onSelectOption, filterOptions = _a.filterOptions;
        var FilterDropdown = dropdown_1.Dropdown.specialize();
        var options = filterOptions || FILTER_OPTIONS;
        var selectedItem = options.filter(function (o) { return o.value === selectedOption; })[0] || options[0];
        return React.createElement("div", {className: "filter-options-dropdown"}, 
            React.createElement(FilterDropdown, {menuClassName: "filter-options", items: options, selectedItem: selectedItem, equal: function (a, b) { return a.value === b.value; }, keyItem: function (d) { return d.value; }, renderItem: this.renderFilterOption.bind(this), renderSelectedItem: function (d) { return React.createElement(svg_icon_1.SvgIcon, {className: "icon", svg: d.svg}); }, onSelect: this.onSelectOption.bind(this)})
        );
    };
    return FilterOptionsDropdown;
}(React.Component));
exports.FilterOptionsDropdown = FilterOptionsDropdown;
