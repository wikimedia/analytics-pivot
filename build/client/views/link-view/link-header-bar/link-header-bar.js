"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./link-header-bar.css');
var React = require('react');
var index_1 = require('../../../components/index');
var LinkHeaderBar = (function (_super) {
    __extends(LinkHeaderBar, _super);
    function LinkHeaderBar() {
        _super.call(this);
        this.state = {
            settingsMenuOpenOn: null,
            userMenuOpenOn: null
        };
    }
    LinkHeaderBar.prototype.onUserMenuClick = function (e) {
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (userMenuOpenOn)
            return this.onUserMenuClose();
        this.setState({
            userMenuOpenOn: e.target
        });
    };
    LinkHeaderBar.prototype.onUserMenuClose = function () {
        this.setState({
            userMenuOpenOn: null
        });
    };
    LinkHeaderBar.prototype.renderUserMenu = function () {
        var _a = this.props, user = _a.user, customization = _a.customization;
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (!userMenuOpenOn)
            return null;
        return React.createElement(index_1.UserMenu, {openOn: userMenuOpenOn, onClose: this.onUserMenuClose.bind(this), user: user, customization: customization});
    };
    LinkHeaderBar.prototype.onSettingsMenuClick = function (e) {
        var settingsMenuOpenOn = this.state.settingsMenuOpenOn;
        if (settingsMenuOpenOn)
            return this.onSettingsMenuClose();
        this.setState({
            settingsMenuOpenOn: e.target
        });
    };
    LinkHeaderBar.prototype.onSettingsMenuClose = function () {
        this.setState({
            settingsMenuOpenOn: null
        });
    };
    LinkHeaderBar.prototype.renderSettingsMenu = function () {
        var _a = this.props, changeTimezone = _a.changeTimezone, timezone = _a.timezone, customization = _a.customization, user = _a.user, stateful = _a.stateful;
        var settingsMenuOpenOn = this.state.settingsMenuOpenOn;
        if (!settingsMenuOpenOn)
            return null;
        return React.createElement(index_1.SettingsMenu, {user: user, timezone: timezone, timezones: customization.getTimezones(), changeTimezone: changeTimezone, openOn: settingsMenuOpenOn, onClose: this.onSettingsMenuClose.bind(this), stateful: stateful});
    };
    LinkHeaderBar.prototype.render = function () {
        var _a = this.props, title = _a.title, user = _a.user, onNavClick = _a.onNavClick, onExploreClick = _a.onExploreClick, customization = _a.customization;
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
        return React.createElement("header", {className: "link-header-bar", style: headerStyle}, 
            React.createElement("div", {className: "left-bar", onClick: onNavClick}, 
                React.createElement("div", {className: "menu-icon"}, 
                    React.createElement(index_1.SvgIcon, {svg: require('../../../icons/menu.svg')})
                ), 
                React.createElement("div", {className: "title"}, title)), 
            React.createElement("div", {className: "right-bar"}, 
                React.createElement("div", {className: "text-button", onClick: onExploreClick}, "Explore"), 
                React.createElement("a", {className: "icon-button help", href: "https://groups.google.com/forum/#!forum/imply-user-group", target: "_blank"}, 
                    React.createElement(index_1.SvgIcon, {className: "help-icon", svg: require('../../../icons/help.svg')})
                ), 
                React.createElement("div", {className: "icon-button settings", onClick: this.onSettingsMenuClick.bind(this)}, 
                    React.createElement(index_1.SvgIcon, {className: "settings-icon", svg: require('../../../icons/full-settings.svg')})
                ), 
                userButton), 
            this.renderUserMenu());
    };
    return LinkHeaderBar;
}(React.Component));
exports.LinkHeaderBar = LinkHeaderBar;
