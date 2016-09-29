"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./no-data-view.css');
var React = require('react');
var constants_1 = require('../../config/constants');
var index_1 = require('../../components/index');
var no_data_header_bar_1 = require('./no-data-header-bar/no-data-header-bar');
var NoDataView = (function (_super) {
    __extends(NoDataView, _super);
    function NoDataView() {
        _super.call(this);
        this.state = {};
    }
    NoDataView.prototype.componentWillReceiveProps = function (nextProps) {
        var clusters = nextProps.appSettings.clusters;
        if (!clusters || !clusters.length) {
            this.setState({
                mode: NoDataView.NO_CLUSTER
            });
        }
        else {
            this.setState({
                mode: NoDataView.NO_CUBE
            });
        }
    };
    NoDataView.prototype.goToSettings = function () {
        window.location.hash = '#settings';
    };
    NoDataView.prototype.renderSettingsIcon = function () {
        var _a = this.props, user = _a.user, stateful = _a.stateful;
        if (!user || !user.allow['settings'] || !stateful)
            return null;
        return React.createElement("div", {className: "icon-button", onClick: this.goToSettings.bind(this)}, 
            React.createElement(index_1.SvgIcon, {svg: require('../../icons/full-settings.svg')})
        );
    };
    NoDataView.prototype.renderTitle = function (mode) {
        return React.createElement("div", {className: "title"}, 
            React.createElement("div", {className: "icon"}, 
                React.createElement(index_1.SvgIcon, {svg: require('../../icons/data-cubes.svg')})
            ), 
            React.createElement("div", {className: "label"}, mode === NoDataView.NO_CUBE ? constants_1.STRINGS.noQueryableDataCubes : constants_1.STRINGS.noConnectedData));
    };
    NoDataView.prototype.renderLink = function (mode) {
        var link = mode === NoDataView.NO_CUBE
            ? React.createElement("a", {href: "#settings/data-cubes"}, "cubes settings")
            : React.createElement("a", {href: "#settings/clusters"}, "clusters settings");
        return React.createElement("div", {className: "action"}, 
            "Please go to the ", 
            link);
    };
    NoDataView.prototype.render = function () {
        var _a = this.props, user = _a.user, onNavClick = _a.onNavClick, onOpenAbout = _a.onOpenAbout, customization = _a.customization, stateful = _a.stateful;
        var mode = this.state.mode;
        return React.createElement("div", {className: "no-data-view"}, 
            React.createElement(no_data_header_bar_1.NoDataHeaderBar, {user: user, onNavClick: onNavClick, customization: customization, title: constants_1.STRINGS.home}, 
                React.createElement("button", {className: "text-button", onClick: onOpenAbout}, constants_1.STRINGS.infoAndFeedback), 
                this.renderSettingsIcon()), 
            React.createElement("div", {className: "container"}, 
                this.renderTitle(mode), 
                stateful ? this.renderLink(mode) : null));
    };
    NoDataView.NO_CLUSTER = 'no-cluster';
    NoDataView.NO_CUBE = 'no-cube';
    return NoDataView;
}(React.Component));
exports.NoDataView = NoDataView;
