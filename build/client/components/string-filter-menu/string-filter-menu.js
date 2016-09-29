"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./string-filter-menu.css');
var React = require('react');
var index_1 = require('../../../common/models/index');
var bubble_menu_1 = require("../bubble-menu/bubble-menu");
var preview_string_filter_menu_1 = require('../preview-string-filter-menu/preview-string-filter-menu');
var selectable_string_filter_menu_1 = require('../selectable-string-filter-menu/selectable-string-filter-menu');
var clearable_input_1 = require("../clearable-input/clearable-input");
var filter_options_dropdown_1 = require("../filter-options-dropdown/filter-options-dropdown");
var StringFilterMenu = (function (_super) {
    __extends(StringFilterMenu, _super);
    function StringFilterMenu() {
        _super.call(this);
        this.state = {
            filterMode: null,
            searchText: null
        };
    }
    StringFilterMenu.prototype.componentWillMount = function () {
        var _a = this.props, essence = _a.essence, dimension = _a.dimension;
        var colors = essence.colors;
        var filterMode = essence.filter.getModeForDimension(dimension);
        if (filterMode && !this.state.filterMode) {
            this.setState({ filterMode: filterMode });
        }
        else if (colors) {
            this.setState({ filterMode: index_1.Filter.INCLUDED });
        }
    };
    StringFilterMenu.prototype.onSelectFilterOption = function (filterMode) {
        this.setState({ filterMode: filterMode });
    };
    StringFilterMenu.prototype.updateSearchText = function (searchText) {
        this.setState({ searchText: searchText });
    };
    StringFilterMenu.prototype.updateFilter = function (clause) {
        var _a = this.props, essence = _a.essence, dimension = _a.dimension, changePosition = _a.changePosition;
        var filter = essence.filter;
        if (!clause)
            return filter.remove(dimension.expression);
        if (changePosition) {
            if (changePosition.isInsert()) {
                return filter.insertByIndex(changePosition.insert, clause);
            }
            else {
                return filter.replaceByIndex(changePosition.replace, clause);
            }
        }
        else {
            return filter.setClause(clause);
        }
    };
    StringFilterMenu.prototype.getFilterOptions = function () {
        var dimension = this.props.dimension;
        var dimensionKind = dimension.kind;
        var filterOptions = filter_options_dropdown_1.FilterOptionsDropdown.getFilterOptions(index_1.Filter.INCLUDED, index_1.Filter.EXCLUDED);
        if (dimensionKind !== 'boolean')
            filterOptions = filterOptions.concat(filter_options_dropdown_1.FilterOptionsDropdown.getFilterOptions(index_1.Filter.REGEX, index_1.Filter.CONTAINS));
        return filterOptions;
    };
    StringFilterMenu.prototype.renderMenuControls = function () {
        var _a = this.state, filterMode = _a.filterMode, searchText = _a.searchText;
        return React.createElement("div", {className: "string-filter-menu-controls"}, 
            React.createElement("div", {className: "side-by-side"}, 
                React.createElement(filter_options_dropdown_1.FilterOptionsDropdown, {selectedOption: filterMode, onSelectOption: this.onSelectFilterOption.bind(this), filterOptions: this.getFilterOptions()}), 
                React.createElement("div", {className: "search-box"}, 
                    React.createElement(clearable_input_1.ClearableInput, {placeholder: "Search", focusOnMount: true, value: searchText, onChange: this.updateSearchText.bind(this)})
                ))
        );
    };
    StringFilterMenu.prototype.render = function () {
        var _a = this.props, dimension = _a.dimension, clicker = _a.clicker, essence = _a.essence, timekeeper = _a.timekeeper, onClose = _a.onClose, containerStage = _a.containerStage, openOn = _a.openOn, inside = _a.inside;
        var _b = this.state, filterMode = _b.filterMode, searchText = _b.searchText;
        if (!dimension)
            return null;
        var menuSize = null;
        var menuCont = null;
        if (filterMode === index_1.Filter.REGEX || filterMode === index_1.Filter.CONTAINS) {
            menuSize = index_1.Stage.fromSize(350, 410);
            menuCont = React.createElement(preview_string_filter_menu_1.PreviewStringFilterMenu, {dimension: dimension, clicker: clicker, essence: essence, timekeeper: timekeeper, onClose: onClose, searchText: searchText, filterMode: filterMode, onClauseChange: this.updateFilter.bind(this)});
        }
        else {
            menuSize = index_1.Stage.fromSize(250, 410);
            menuCont = React.createElement(selectable_string_filter_menu_1.SelectableStringFilterMenu, {dimension: dimension, clicker: clicker, essence: essence, timekeeper: timekeeper, onClose: onClose, searchText: searchText, filterMode: filterMode, onClauseChange: this.updateFilter.bind(this)});
        }
        return React.createElement(bubble_menu_1.BubbleMenu, {className: "string-filter-menu", direction: "down", containerStage: containerStage, stage: menuSize, openOn: openOn, onClose: onClose, inside: inside}, 
            this.renderMenuControls(), 
            menuCont);
    };
    return StringFilterMenu;
}(React.Component));
exports.StringFilterMenu = StringFilterMenu;
