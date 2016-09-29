"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./settings-header-bar.css');
var React = require('react');
var index_1 = require('../../../components/index');
var SettingsHeaderBar = (function (_super) {
    __extends(SettingsHeaderBar, _super);
    function SettingsHeaderBar() {
        _super.call(this);
        this.state = {
            userMenuOpenOn: null
        };
    }
    SettingsHeaderBar.prototype.onUserMenuClick = function (e) {
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (userMenuOpenOn)
            return this.onUserMenuClose();
        this.setState({
            userMenuOpenOn: e.target
        });
    };
    SettingsHeaderBar.prototype.onUserMenuClose = function () {
        this.setState({
            userMenuOpenOn: null
        });
    };
    SettingsHeaderBar.prototype.renderUserMenu = function () {
        var _a = this.props, user = _a.user, customization = _a.customization;
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (!userMenuOpenOn)
            return null;
        return React.createElement(index_1.UserMenu, {openOn: userMenuOpenOn, onClose: this.onUserMenuClose.bind(this), user: user, customization: customization});
    };
    SettingsHeaderBar.prototype.render = function () {
        var _a = this.props, user = _a.user, onNavClick = _a.onNavClick, customization = _a.customization, title = _a.title;
        var userButton = null;
        if (user) {
            userButton = React.createElement("div", {className: "icon-button user", onClick: this.onUserMenuClick.bind(this)}, 
                React.createElement(index_1.SvgIcon, {svg: require('../../../icons/full-user.svg')})
            );
        }
        var headerStyle = null;
        if (customization && customization.headerBackground) {
            headerStyle = {
                background: customization.headerBackground
            };
        }
        return React.createElement("header", {className: "settings-header-bar", style: headerStyle}, 
            React.createElement("div", {className: "left-bar", onClick: onNavClick}, 
                React.createElement("div", {className: "menu-icon"}, 
                    React.createElement(index_1.SvgIcon, {svg: require('../../../icons/menu.svg')})
                ), 
                React.createElement("div", {className: "title"}, title)), 
            React.createElement("div", {className: "right-bar"}, 
                this.props.children, 
                userButton), 
            this.renderUserMenu());
    };
    return SettingsHeaderBar;
}(React.Component));
exports.SettingsHeaderBar = SettingsHeaderBar;
