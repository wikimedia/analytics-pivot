"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./cube-header-bar.css');
var React = require('react');
var immutable_class_1 = require("immutable-class");
var chronoshift_1 = require('chronoshift');
var dom_1 = require("../../../utils/dom/dom");
var index_1 = require('../../../components/index');
var CubeHeaderBar = (function (_super) {
    __extends(CubeHeaderBar, _super);
    function CubeHeaderBar() {
        _super.call(this);
        this.state = {
            hilukMenuOpenOn: null,
            autoRefreshMenuOpenOn: null,
            autoRefreshRate: null,
            settingsMenuOpenOn: null,
            userMenuOpenOn: null,
            animating: false
        };
    }
    CubeHeaderBar.prototype.componentDidMount = function () {
        this.mounted = true;
        var dataCube = this.props.essence.dataCube;
        this.setAutoRefreshFromDataCube(dataCube);
    };
    CubeHeaderBar.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        if (this.props.essence.dataCube.name !== nextProps.essence.dataCube.name) {
            this.setAutoRefreshFromDataCube(nextProps.essence.dataCube);
        }
        if (!this.props.updatingMaxTime && nextProps.updatingMaxTime) {
            this.setState({ animating: true });
            setTimeout(function () {
                if (!_this.mounted)
                    return;
                _this.setState({ animating: false });
            }, 1000);
        }
    };
    CubeHeaderBar.prototype.componentWillUnmount = function () {
        this.mounted = false;
        this.clearTimerIfExists();
    };
    CubeHeaderBar.prototype.setAutoRefreshFromDataCube = function (dataCube) {
        var refreshRule = dataCube.refreshRule;
        if (refreshRule.isFixed())
            return;
        this.setAutoRefreshRate(chronoshift_1.Duration.fromJS('PT5M'));
    };
    CubeHeaderBar.prototype.setAutoRefreshRate = function (rate) {
        var autoRefreshRate = this.state.autoRefreshRate;
        if (immutable_class_1.immutableEqual(autoRefreshRate, rate))
            return;
        this.clearTimerIfExists();
        var refreshMaxTime = this.props.refreshMaxTime;
        if (refreshMaxTime && rate) {
            this.autoRefreshTimer = setInterval(function () {
                refreshMaxTime();
            }, rate.getCanonicalLength());
        }
        this.setState({
            autoRefreshRate: rate
        });
    };
    CubeHeaderBar.prototype.clearTimerIfExists = function () {
        if (this.autoRefreshTimer) {
            clearInterval(this.autoRefreshTimer);
            this.autoRefreshTimer = null;
        }
    };
    CubeHeaderBar.prototype.onHilukMenuClick = function (e) {
        var hilukMenuOpenOn = this.state.hilukMenuOpenOn;
        if (hilukMenuOpenOn)
            return this.onHilukMenuClose();
        this.setState({
            hilukMenuOpenOn: e.target
        });
    };
    CubeHeaderBar.prototype.onHilukMenuClose = function () {
        this.setState({
            hilukMenuOpenOn: null
        });
    };
    CubeHeaderBar.prototype.renderHilukMenu = function () {
        var _this = this;
        var _a = this.props, essence = _a.essence, timekeeper = _a.timekeeper, getUrlPrefix = _a.getUrlPrefix, customization = _a.customization, openRawDataModal = _a.openRawDataModal, getDownloadableDataset = _a.getDownloadableDataset, addEssenceToCollection = _a.addEssenceToCollection, stateful = _a.stateful;
        var hilukMenuOpenOn = this.state.hilukMenuOpenOn;
        if (!hilukMenuOpenOn)
            return null;
        var externalViews = null;
        if (customization && customization.externalViews) {
            externalViews = customization.externalViews;
        }
        var onAddEssenceToCollectionClick = null;
        if (stateful) {
            onAddEssenceToCollectionClick = function () {
                _this.setState({
                    hilukMenuOpenOn: null
                });
                addEssenceToCollection();
            };
        }
        return React.createElement(index_1.HilukMenu, {essence: essence, timekeeper: timekeeper, openOn: hilukMenuOpenOn, onClose: this.onHilukMenuClose.bind(this), getUrlPrefix: getUrlPrefix, openRawDataModal: openRawDataModal, externalViews: externalViews, getDownloadableDataset: getDownloadableDataset, addEssenceToCollection: onAddEssenceToCollectionClick});
    };
    CubeHeaderBar.prototype.onAutoRefreshMenuClick = function (e) {
        var autoRefreshMenuOpenOn = this.state.autoRefreshMenuOpenOn;
        if (autoRefreshMenuOpenOn)
            return this.onAutoRefreshMenuClose();
        this.setState({
            autoRefreshMenuOpenOn: e.target
        });
    };
    CubeHeaderBar.prototype.onAutoRefreshMenuClose = function () {
        this.setState({
            autoRefreshMenuOpenOn: null
        });
    };
    CubeHeaderBar.prototype.renderAutoRefreshMenu = function () {
        var _a = this.props, refreshMaxTime = _a.refreshMaxTime, essence = _a.essence, timekeeper = _a.timekeeper;
        var _b = this.state, autoRefreshMenuOpenOn = _b.autoRefreshMenuOpenOn, autoRefreshRate = _b.autoRefreshRate;
        if (!autoRefreshMenuOpenOn)
            return null;
        return React.createElement(index_1.AutoRefreshMenu, {timekeeper: timekeeper, openOn: autoRefreshMenuOpenOn, onClose: this.onAutoRefreshMenuClose.bind(this), autoRefreshRate: autoRefreshRate, setAutoRefreshRate: this.setAutoRefreshRate.bind(this), refreshMaxTime: refreshMaxTime, dataCube: essence.dataCube, timezone: essence.timezone});
    };
    CubeHeaderBar.prototype.onUserMenuClick = function (e) {
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (userMenuOpenOn)
            return this.onUserMenuClose();
        this.setState({
            userMenuOpenOn: e.target
        });
    };
    CubeHeaderBar.prototype.onUserMenuClose = function () {
        this.setState({
            userMenuOpenOn: null
        });
    };
    CubeHeaderBar.prototype.renderUserMenu = function () {
        var _a = this.props, user = _a.user, customization = _a.customization;
        var userMenuOpenOn = this.state.userMenuOpenOn;
        if (!userMenuOpenOn)
            return null;
        return React.createElement(index_1.UserMenu, {openOn: userMenuOpenOn, onClose: this.onUserMenuClose.bind(this), user: user, customization: customization});
    };
    CubeHeaderBar.prototype.onSettingsMenuClick = function (e) {
        var settingsMenuOpenOn = this.state.settingsMenuOpenOn;
        if (settingsMenuOpenOn)
            return this.onSettingsMenuClose();
        if (e.metaKey && e.altKey) {
            console.log(this.props.essence.toJS());
            return;
        }
        this.setState({
            settingsMenuOpenOn: e.target
        });
    };
    CubeHeaderBar.prototype.onSettingsMenuClose = function () {
        this.setState({
            settingsMenuOpenOn: null
        });
    };
    CubeHeaderBar.prototype.renderSettingsMenu = function () {
        var _a = this.props, changeTimezone = _a.changeTimezone, timezone = _a.timezone, customization = _a.customization, essence = _a.essence, user = _a.user, stateful = _a.stateful;
        var settingsMenuOpenOn = this.state.settingsMenuOpenOn;
        if (!settingsMenuOpenOn)
            return null;
        return React.createElement(index_1.SettingsMenu, {dataCube: essence.dataCube, user: user, timezone: timezone, timezones: customization.getTimezones(), changeTimezone: changeTimezone, openOn: settingsMenuOpenOn, onClose: this.onSettingsMenuClose.bind(this), stateful: stateful});
    };
    CubeHeaderBar.prototype.render = function () {
        var _a = this.props, user = _a.user, onNavClick = _a.onNavClick, essence = _a.essence, customization = _a.customization;
        var animating = this.state.animating;
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
        return React.createElement("header", {className: "cube-header-bar", style: headerStyle}, 
            React.createElement("div", {className: "left-bar", onClick: onNavClick}, 
                React.createElement("div", {className: "menu-icon"}, 
                    React.createElement(index_1.SvgIcon, {svg: require('../../../icons/menu.svg')})
                ), 
                React.createElement("div", {className: "title"}, essence.dataCube.title)), 
            React.createElement("div", {className: "right-bar"}, 
                React.createElement("div", {className: dom_1.classNames("icon-button", "auto-refresh", { "refreshing": animating }), onClick: this.onAutoRefreshMenuClick.bind(this)}, 
                    React.createElement(index_1.SvgIcon, {className: "auto-refresh-icon", svg: require('../../../icons/full-refresh.svg')})
                ), 
                React.createElement("div", {className: "icon-button hiluk", onClick: this.onHilukMenuClick.bind(this)}, 
                    React.createElement(index_1.SvgIcon, {className: "hiluk-icon", svg: require('../../../icons/full-hiluk.svg')})
                ), 
                React.createElement("div", {className: "icon-button settings", onClick: this.onSettingsMenuClick.bind(this)}, 
                    React.createElement(index_1.SvgIcon, {className: "settings-icon", svg: require('../../../icons/full-settings.svg')})
                ), 
                userButton), 
            this.renderHilukMenu(), 
            this.renderAutoRefreshMenu(), 
            this.renderSettingsMenu(), 
            this.renderUserMenu());
    };
    return CubeHeaderBar;
}(React.Component));
exports.CubeHeaderBar = CubeHeaderBar;
