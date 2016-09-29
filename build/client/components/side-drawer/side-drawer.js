"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./side-drawer.css');
var React = require('react');
var ReactDOM = require('react-dom');
var constants_1 = require('../../config/constants');
var dom_1 = require('../../utils/dom/dom');
var nav_logo_1 = require('../nav-logo/nav-logo');
var svg_icon_1 = require('../svg-icon/svg-icon');
var nav_list_1 = require('../nav-list/nav-list');
var SideDrawer = (function (_super) {
    __extends(SideDrawer, _super);
    function SideDrawer() {
        _super.call(this);
        this.globalMouseDownListener = this.globalMouseDownListener.bind(this);
        this.globalKeyDownListener = this.globalKeyDownListener.bind(this);
    }
    SideDrawer.prototype.componentDidMount = function () {
        window.addEventListener('mousedown', this.globalMouseDownListener);
        window.addEventListener('keydown', this.globalKeyDownListener);
    };
    SideDrawer.prototype.componentWillUnmount = function () {
        window.removeEventListener('mousedown', this.globalMouseDownListener);
        window.removeEventListener('keydown', this.globalKeyDownListener);
    };
    SideDrawer.prototype.globalMouseDownListener = function (e) {
        var myElement = ReactDOM.findDOMNode(this);
        var target = e.target;
        if (dom_1.isInside(target, myElement))
            return;
        this.props.onClose();
    };
    SideDrawer.prototype.globalKeyDownListener = function (e) {
        if (!dom_1.escapeKey(e))
            return;
        this.props.onClose();
    };
    SideDrawer.prototype.onHomeClick = function () {
        window.location.hash = '#';
    };
    SideDrawer.prototype.onOpenSettings = function () {
        window.location.hash = '#settings';
    };
    SideDrawer.prototype.renderOverviewLink = function () {
        var viewType = this.props.viewType;
        return React.createElement("div", {className: "home-container"}, 
            React.createElement("div", {className: dom_1.classNames('home-link', { selected: viewType === 'home' }), onClick: this.onHomeClick.bind(this)}, 
                React.createElement(svg_icon_1.SvgIcon, {svg: require('../../icons/home.svg')}), 
                React.createElement("span", null, viewType === 'link' ? 'Overview' : 'Home'))
        );
    };
    SideDrawer.prototype.renderItems = function (items, icon, urlPrefix) {
        if (urlPrefix === void 0) { urlPrefix = ''; }
        if (!items || items.length === 0)
            return null;
        var _a = this.props, itemHrefFn = _a.itemHrefFn, selectedItem = _a.selectedItem;
        var navLinks = items.map(function (item) {
            return {
                name: item.name,
                title: item.title,
                tooltip: item.description,
                href: itemHrefFn(selectedItem, item) || "#" + urlPrefix + item.name
            };
        });
        return React.createElement(nav_list_1.NavList, {selected: selectedItem ? selectedItem.name : null, navLinks: navLinks, iconSvg: require("../../icons/" + icon)});
    };
    SideDrawer.prototype.render = function () {
        var _this = this;
        var _a = this.props, onClose = _a.onClose, selectedItem = _a.selectedItem, collections = _a.collections, dataCubes = _a.dataCubes, onOpenAbout = _a.onOpenAbout, customization = _a.customization, itemHrefFn = _a.itemHrefFn, user = _a.user;
        var infoAndFeedback = [];
        if (user && user.allow['settings']) {
            infoAndFeedback.push({
                name: 'settings',
                title: constants_1.STRINGS.settings,
                tooltip: 'Settings',
                onClick: function () {
                    onClose();
                    _this.onOpenSettings();
                }
            });
        }
        infoAndFeedback.push({
            name: 'info',
            title: constants_1.STRINGS.infoAndFeedback,
            tooltip: 'Learn more about Pivot',
            onClick: function () {
                onClose();
                onOpenAbout();
            }
        });
        var customLogoSvg = null;
        if (customization && customization.customLogoSvg) {
            customLogoSvg = customization.customLogoSvg;
        }
        return React.createElement("div", {className: "side-drawer"}, 
            React.createElement(nav_logo_1.NavLogo, {customLogoSvg: customLogoSvg, onClick: onClose}), 
            this.renderOverviewLink(), 
            this.renderItems(dataCubes, 'full-cube.svg'), 
            this.renderItems(collections, 'full-collection.svg', 'collection/'), 
            React.createElement(nav_list_1.NavList, {navLinks: infoAndFeedback}));
    };
    return SideDrawer;
}(React.Component));
exports.SideDrawer = SideDrawer;
