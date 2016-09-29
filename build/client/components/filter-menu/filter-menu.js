"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./filter-menu.css');
var React = require("react");
var string_filter_menu_1 = require("../string-filter-menu/string-filter-menu");
var time_filter_menu_1 = require("../time-filter-menu/time-filter-menu");
var number_filter_menu_1 = require("../number-filter-menu/number-filter-menu");
var FilterMenu = (function (_super) {
    __extends(FilterMenu, _super);
    function FilterMenu() {
        _super.call(this);
    }
    FilterMenu.prototype.render = function () {
        var _a = this.props, clicker = _a.clicker, essence = _a.essence, timekeeper = _a.timekeeper, changePosition = _a.changePosition, containerStage = _a.containerStage, openOn = _a.openOn, dimension = _a.dimension, onClose = _a.onClose, inside = _a.inside;
        if (!dimension)
            return null;
        if (dimension.kind === 'time') {
            return React.createElement(time_filter_menu_1.TimeFilterMenu, {essence: essence, timekeeper: timekeeper, clicker: clicker, dimension: dimension, onClose: onClose, containerStage: containerStage, openOn: openOn, inside: inside});
        }
        else if (dimension.kind === 'number') {
            return React.createElement(number_filter_menu_1.NumberFilterMenu, {essence: essence, timekeeper: timekeeper, clicker: clicker, dimension: dimension, onClose: onClose, containerStage: containerStage, openOn: openOn, inside: inside});
        }
        else {
            return React.createElement(string_filter_menu_1.StringFilterMenu, {essence: essence, timekeeper: timekeeper, clicker: clicker, dimension: dimension, changePosition: changePosition, onClose: onClose, containerStage: containerStage, openOn: openOn, inside: inside});
        }
    };
    return FilterMenu;
}(React.Component));
exports.FilterMenu = FilterMenu;
