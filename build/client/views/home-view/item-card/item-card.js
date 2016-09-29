"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./item-card.css');
var React = require('react');
var constants_1 = require('../../../config/constants');
var svg_icon_1 = require('../../../components/svg-icon/svg-icon');
var ItemCard = (function (_super) {
    __extends(ItemCard, _super);
    function ItemCard() {
        _super.apply(this, arguments);
    }
    ItemCard.getNewItemCard = function (onClick) {
        return React.createElement("div", {className: "item-card new-one", onClick: onClick}, 
            React.createElement("div", {className: "inner-container"}, 
                React.createElement(svg_icon_1.SvgIcon, {svg: require('../../../icons/full-add.svg')})
            )
        );
    };
    ItemCard.prototype.render = function () {
        var _a = this.props, title = _a.title, description = _a.description, icon = _a.icon, onClick = _a.onClick, count = _a.count;
        return React.createElement("div", {className: "item-card", onClick: onClick}, 
            React.createElement("div", {className: "inner-container"}, 
                React.createElement(svg_icon_1.SvgIcon, {svg: require("../../../icons/" + icon + ".svg")}), 
                React.createElement("div", {className: "text"}, 
                    React.createElement("div", {className: "title"}, 
                        title, 
                        " ", 
                        count !== undefined ? React.createElement("span", {className: "count"}, count) : null), 
                    React.createElement("div", {className: "description"}, description || constants_1.STRINGS.noDescription)))
        );
    };
    return ItemCard;
}(React.Component));
exports.ItemCard = ItemCard;
