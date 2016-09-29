"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./collection-header-bar.css');
var React = require('react');
var index_1 = require('../../../../common/models/index');
var index_2 = require('../../../components/index');
var constants_1 = require('../../../config/constants');
var CollectionHeaderBar = (function (_super) {
    __extends(CollectionHeaderBar, _super);
    function CollectionHeaderBar() {
        _super.call(this);
        this.state = {
            userMenuOpenOn: null,
            addMenuOpenOn: null,
            settingsMenuOpenOn: null
        };
    }
    CollectionHeaderBar.prototype.onUserMenuClick = function (e) {
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (userMenuOpenOn)
            return this.onUserMenuClose();
        this.setState({
            userMenuOpenOn: e.target
        });
    };
    CollectionHeaderBar.prototype.onUserMenuClose = function () {
        this.setState({
            userMenuOpenOn: null
        });
    };
    CollectionHeaderBar.prototype.renderUserMenu = function () {
        var _a = this.props, user = _a.user, customization = _a.customization;
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (!userMenuOpenOn)
            return null;
        return React.createElement(index_2.UserMenu, {customization: customization, openOn: userMenuOpenOn, onClose: this.onUserMenuClose.bind(this), user: user});
    };
    CollectionHeaderBar.prototype.onAddClick = function (e) {
        var addMenuOpenOn = this.state.addMenuOpenOn;
        if (addMenuOpenOn)
            return this.onAddMenuClose();
        this.setState({
            addMenuOpenOn: e.target
        });
    };
    CollectionHeaderBar.prototype.onAddMenuClose = function () {
        this.setState({
            addMenuOpenOn: null
        });
    };
    CollectionHeaderBar.prototype.onSettingsClick = function (e) {
        var settingsMenuOpenOn = this.state.settingsMenuOpenOn;
        if (settingsMenuOpenOn)
            return this.onSettingsMenuClose();
        this.setState({
            settingsMenuOpenOn: e.target
        });
    };
    CollectionHeaderBar.prototype.onSettingsMenuClose = function () {
        this.setState({
            settingsMenuOpenOn: null
        });
    };
    CollectionHeaderBar.prototype.goToSettings = function () {
        window.location.hash = '#settings';
    };
    CollectionHeaderBar.prototype.renderSettingsMenu = function () {
        var user = this.props.user;
        var settingsMenuOpenOn = this.state.settingsMenuOpenOn;
        if (!settingsMenuOpenOn)
            return null;
        var stage = index_1.Stage.fromSize(200, 200);
        return React.createElement(index_2.BubbleMenu, {className: "collection-settings-menu", direction: "down", stage: stage, openOn: settingsMenuOpenOn, onClose: this.onSettingsMenuClose.bind(this)}, 
            React.createElement("ul", {className: "bubble-list"}, 
                React.createElement("li", {className: "delete", onClick: this.props.onDeleteCollection}, constants_1.STRINGS.deleteCollection), 
                user && user.allow['settings'] ? React.createElement("li", {className: "general-settings", onClick: this.goToSettings.bind(this)}, constants_1.STRINGS.generalSettings)
                    : null)
        );
    };
    CollectionHeaderBar.prototype.renderAddMenu = function () {
        var _this = this;
        var dataCubes = this.props.dataCubes;
        var addMenuOpenOn = this.state.addMenuOpenOn;
        if (!addMenuOpenOn)
            return null;
        var stage = index_1.Stage.fromSize(200, 200);
        var items = dataCubes.map(function (dataCube) {
            return React.createElement("li", {className: "data-cube", key: dataCube.name, onClick: _this.props.onAddItem.bind(_this, dataCube)}, dataCube.title);
        });
        return React.createElement(index_2.BubbleMenu, {className: "add-menu", direction: "down", stage: stage, openOn: addMenuOpenOn, onClose: this.onAddMenuClose.bind(this)}, 
            React.createElement("div", {className: "bubble-list-title"}, 
                constants_1.STRINGS.addFromCube, 
                ":"), 
            React.createElement("ul", {className: "bubble-list"}, items));
    };
    CollectionHeaderBar.prototype.getHeaderStyle = function (customization) {
        var headerStyle = null;
        if (customization && customization.headerBackground) {
            headerStyle = {
                background: customization.headerBackground
            };
        }
        return headerStyle;
    };
    CollectionHeaderBar.prototype.renderEditableBar = function () {
        var _a = this.props, customization = _a.customization, title = _a.title, onSave = _a.onSave, onCancel = _a.onCancel, onCollectionTitleChange = _a.onCollectionTitleChange;
        var onTitleChange = function (e) {
            onCollectionTitleChange(e.target.value);
        };
        return React.createElement("header", {className: "collection-header-bar", style: this.getHeaderStyle(customization)}, 
            React.createElement("div", {className: "left-bar"}, 
                React.createElement("div", {className: "title"}, 
                    React.createElement("input", {value: title, onChange: onTitleChange})
                )
            ), 
            React.createElement("div", {className: "right-bar"}, 
                React.createElement("div", {className: "button-group"}, 
                    React.createElement(index_2.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: onCancel}), 
                    React.createElement(index_2.Button, {className: "save", title: "Save", type: "primary", onClick: onSave}))
            ));
    };
    CollectionHeaderBar.prototype.render = function () {
        var _a = this.props, user = _a.user, onNavClick = _a.onNavClick, customization = _a.customization, title = _a.title, editionMode = _a.editionMode, onEditCollection = _a.onEditCollection, onAddItem = _a.onAddItem;
        if (editionMode)
            return this.renderEditableBar();
        var userButton = null;
        if (user) {
            userButton = React.createElement("div", {className: "icon-button user", onClick: this.onUserMenuClick.bind(this)}, 
                React.createElement(index_2.SvgIcon, {svg: require('../../../icons/full-user.svg')})
            );
        }
        return React.createElement("header", {className: "collection-header-bar", style: this.getHeaderStyle(customization)}, 
            React.createElement("div", {className: "left-bar", onClick: onNavClick}, 
                React.createElement("div", {className: "menu-icon"}, 
                    React.createElement(index_2.SvgIcon, {svg: require('../../../icons/menu.svg')})
                ), 
                React.createElement("div", {className: "title"}, title)), 
            React.createElement("div", {className: "right-bar"}, 
                onAddItem ?
                    React.createElement("div", {className: "icon-button add", onClick: this.onAddClick.bind(this)}, 
                        React.createElement(index_2.SvgIcon, {svg: require('../../../icons/full-add-framed.svg')})
                    )
                    : null, 
                onEditCollection ?
                    React.createElement("div", {className: "icon-button edit", onClick: onEditCollection}, 
                        React.createElement(index_2.SvgIcon, {svg: require('../../../icons/full-edit.svg')})
                    )
                    : null, 
                React.createElement("div", {className: "icon-button settings", onClick: this.onSettingsClick.bind(this)}, 
                    React.createElement(index_2.SvgIcon, {svg: require('../../../icons/full-settings.svg')})
                ), 
                userButton), 
            this.renderUserMenu(), 
            this.renderAddMenu(), 
            this.renderSettingsMenu());
    };
    return CollectionHeaderBar;
}(React.Component));
exports.CollectionHeaderBar = CollectionHeaderBar;
