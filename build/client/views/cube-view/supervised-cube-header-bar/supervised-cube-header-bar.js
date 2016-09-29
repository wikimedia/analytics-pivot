"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./supervised-cube-header-bar.css');
var React = require('react');
var index_1 = require('../../../components/index');
var SupervisedCubeHeaderBar = (function (_super) {
    __extends(SupervisedCubeHeaderBar, _super);
    function SupervisedCubeHeaderBar() {
        _super.call(this);
        this.state = {};
    }
    SupervisedCubeHeaderBar.prototype.onSettingsMenuClick = function (e) {
        var settingsMenuOpen = this.state.settingsMenuOpen;
        if (settingsMenuOpen)
            return this.onSettingsMenuClose();
        this.setState({
            settingsMenuOpen: e.target
        });
    };
    SupervisedCubeHeaderBar.prototype.onSettingsMenuClose = function () {
        this.setState({
            settingsMenuOpen: null
        });
    };
    SupervisedCubeHeaderBar.prototype.renderSettingsMenu = function () {
        var _a = this.props, changeTimezone = _a.changeTimezone, timezone = _a.timezone, customization = _a.customization, essence = _a.essence;
        var settingsMenuOpen = this.state.settingsMenuOpen;
        if (!settingsMenuOpen)
            return null;
        return React.createElement(index_1.SettingsMenu, {dataCube: essence.dataCube, timezone: timezone, timezones: customization.getTimezones(), changeTimezone: changeTimezone, openOn: settingsMenuOpen, onClose: this.onSettingsMenuClose.bind(this), stateful: true});
    };
    SupervisedCubeHeaderBar.prototype.onSave = function () {
        var _a = this.props, supervisor = _a.supervisor, essence = _a.essence;
        if (supervisor.save) {
            supervisor.save(essence);
        }
        else if (supervisor.getConfirmationModal) {
            this.setState({ needsConfirmation: true });
        }
    };
    SupervisedCubeHeaderBar.prototype.render = function () {
        var _this = this;
        var _a = this.props, supervisor = _a.supervisor, customization = _a.customization, essence = _a.essence;
        var needsConfirmation = this.state.needsConfirmation;
        var headerStyle = null;
        if (customization && customization.headerBackground) {
            headerStyle = {
                background: customization.headerBackground
            };
        }
        var modal = null;
        if (needsConfirmation) {
            modal = React.cloneElement(supervisor.getConfirmationModal(essence), { onCancel: function () { return _this.setState({ needsConfirmation: false }); } });
        }
        return React.createElement("header", {className: "supervised-cube-header-bar", style: headerStyle}, 
            React.createElement("div", {className: "left-bar"}, 
                React.createElement("div", {className: "title"}, supervisor.title)
            ), 
            React.createElement("div", {className: "right-bar"}, 
                React.createElement("div", {className: "icon-button settings", onClick: this.onSettingsMenuClick.bind(this)}, 
                    React.createElement(index_1.SvgIcon, {className: "settings-icon", svg: require('../../../icons/full-settings.svg')})
                ), 
                React.createElement("div", {className: "button-group"}, 
                    React.createElement(index_1.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: supervisor.cancel}), 
                    React.createElement(index_1.Button, {className: "save", title: supervisor.saveLabel || 'Save', type: "primary", onClick: this.onSave.bind(this)}))), 
            this.renderSettingsMenu(), 
            modal);
    };
    return SupervisedCubeHeaderBar;
}(React.Component));
exports.SupervisedCubeHeaderBar = SupervisedCubeHeaderBar;
