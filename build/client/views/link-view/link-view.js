"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./link-view.css');
var React = require('react');
var ReactDOM = require('react-dom');
var plywood_1 = require('plywood');
var dom_1 = require('../../utils/dom/dom');
var index_1 = require('../../../common/models/index');
var localStorage = require('../../utils/local-storage/local-storage');
var constants_1 = require("../../config/constants");
var index_2 = require('../../components/index');
var index_3 = require('../../visualizations/index');
var link_header_bar_1 = require('./link-header-bar/link-header-bar');
var $maxTime = plywood_1.$(index_1.FilterClause.MAX_TIME_REF_NAME);
var latestPresets = [
    { name: constants_1.STRINGS.last5Minutes, selection: $maxTime.timeRange('PT5M', -1) },
    { name: constants_1.STRINGS.lastHour, selection: $maxTime.timeRange('PT1H', -1) },
    { name: constants_1.STRINGS.lastDay, selection: $maxTime.timeRange('P1D', -1) },
    { name: constants_1.STRINGS.lastWeek, selection: $maxTime.timeRange('P1W', -1) }
];
var MIN_PANEL_WIDTH = 240;
var MAX_PANEL_WIDTH = 400;
var LinkView = (function (_super) {
    __extends(LinkView, _super);
    function LinkView() {
        var _this = this;
        _super.call(this);
        this.state = {
            linkTile: null,
            essence: null,
            visualizationStage: null,
            menuStage: null,
            layout: this.getStoredLayout()
        };
        var clicker = {
            changeFilter: function (filter, colors) {
                var essence = _this.state.essence;
                essence = essence.changeFilter(filter);
                if (colors)
                    essence = essence.changeColors(colors);
                _this.setState({ essence: essence });
            },
            changeTimeSelection: function (selection) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changeTimeSelection(selection) });
            },
            changeColors: function (colors) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changeColors(colors) });
            },
            changePinnedSortMeasure: function (measure) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changePinnedSortMeasure(measure) });
            },
            toggleMeasure: function (measure) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.toggleSelectedMeasure(measure) });
            },
            changeHighlight: function (owner, measure, delta) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changeHighlight(owner, measure, delta) });
            },
            acceptHighlight: function () {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.acceptHighlight() });
            },
            dropHighlight: function () {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.dropHighlight() });
            }
        };
        this.clicker = clicker;
        this.globalResizeListener = this.globalResizeListener.bind(this);
    }
    LinkView.prototype.componentWillMount = function () {
        var _a = this.props, hash = _a.hash, collection = _a.collection, updateViewHash = _a.updateViewHash;
        var linkTile = collection.findByName(hash);
        if (!linkTile) {
            linkTile = collection.getDefaultTile();
            updateViewHash(linkTile.name);
        }
        this.setState({
            linkTile: linkTile,
            essence: linkTile.essence
        });
    };
    LinkView.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.globalResizeListener);
        this.globalResizeListener();
    };
    LinkView.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props, hash = _a.hash, collection = _a.collection;
        if (hash !== nextProps.hash) {
            var linkTile = collection.findByName(hash);
            this.setState({ linkTile: linkTile });
        }
    };
    LinkView.prototype.componentWillUpdate = function (nextProps, nextState) {
        var updateViewHash = this.props.updateViewHash;
        var linkTile = this.state.linkTile;
        if (updateViewHash && !nextState.linkTile.equals(linkTile)) {
            updateViewHash(nextState.linkTile.name);
        }
    };
    LinkView.prototype.componentWillUnmount = function () {
        window.removeEventListener('resize', this.globalResizeListener);
    };
    LinkView.prototype.globalResizeListener = function () {
        var _a = this.refs, container = _a.container, visualization = _a.visualization;
        var containerDOM = ReactDOM.findDOMNode(container);
        var visualizationDOM = ReactDOM.findDOMNode(visualization);
        if (!containerDOM || !visualizationDOM)
            return;
        var deviceSize = 'large';
        if (window.innerWidth <= 1250)
            deviceSize = 'medium';
        if (window.innerWidth <= 1080)
            deviceSize = 'small';
        this.setState({
            deviceSize: deviceSize,
            menuStage: index_1.Stage.fromClientRect(containerDOM.getBoundingClientRect()),
            visualizationStage: index_1.Stage.fromClientRect(visualizationDOM.getBoundingClientRect())
        });
    };
    LinkView.prototype.selectLinkItem = function (linkTile) {
        var essence = this.state.essence;
        var newEssence = linkTile.essence;
        if (essence.getTimeAttribute()) {
            newEssence = newEssence.changeTimeSelection(essence.getTimeSelection());
        }
        this.setState({
            linkTile: linkTile,
            essence: newEssence
        });
    };
    LinkView.prototype.goToCubeView = function () {
        var _a = this.props, changeHash = _a.changeHash, getUrlPrefix = _a.getUrlPrefix;
        var essence = this.state.essence;
        changeHash(essence.dataCube.name + "/" + essence.toHash(), true);
    };
    LinkView.prototype.changeTimezone = function (newTimezone) {
        var essence = this.state.essence;
        var newEssence = essence.changeTimezone(newTimezone);
        this.setState({ essence: newEssence });
    };
    LinkView.prototype.getStoredLayout = function () {
        return localStorage.get('link-view-layout') || { linkPanelWidth: 240, pinboardWidth: 240 };
    };
    LinkView.prototype.storeLayout = function (layout) {
        localStorage.set('link-view-layout', layout);
    };
    LinkView.prototype.onLinkPanelResize = function (value) {
        var layout = this.state.layout;
        layout.linkPanelWidth = value;
        this.setState({ layout: layout });
        this.storeLayout(layout);
    };
    LinkView.prototype.onPinboardPanelResize = function (value) {
        var layout = this.state.layout;
        layout.pinboardWidth = value;
        this.setState({ layout: layout });
        this.storeLayout(layout);
    };
    LinkView.prototype.onPanelResizeEnd = function () {
        this.globalResizeListener();
    };
    LinkView.prototype.selectPreset = function (p) {
        this.clicker.changeTimeSelection(p.selection);
    };
    LinkView.prototype.renderPresets = function () {
        var essence = this.state.essence;
        var PresetDropdown = index_2.Dropdown.specialize();
        var selected = plywood_1.find(latestPresets, function (p) { return p.selection.equals(essence.getTimeSelection()); });
        return React.createElement(PresetDropdown, {items: latestPresets, selectedItem: selected, equal: function (a, b) {
            if (a === b)
                return true;
            if (!a !== !b)
                return false;
            return a.selection === b.selection;
        }, renderItem: function (p) { return p ? p.name : ""; }, onSelect: this.selectPreset.bind(this)});
    };
    LinkView.prototype.renderLinkPanel = function (style) {
        var _this = this;
        var collection = this.props.collection;
        var linkTile = this.state.linkTile;
        var groupId = 0;
        var lastGroup = null;
        var items = [];
        collection.tiles.forEach(function (li) {
            if (lastGroup !== li.group) {
                items.push(React.createElement("div", {className: "link-group-title", key: 'group_' + groupId}, li.group));
                groupId++;
                lastGroup = li.group;
            }
            items.push(React.createElement("div", {className: dom_1.classNames('link-item', { selected: li === linkTile }), key: 'li_' + li.name, onClick: _this.selectLinkItem.bind(_this, li)}, li.title));
        });
        return React.createElement("div", {className: "link-panel", style: style}, 
            React.createElement("div", {className: "link-container"}, items)
        );
    };
    LinkView.prototype.render = function () {
        var clicker = this.clicker;
        var _a = this.props, timekeeper = _a.timekeeper, getUrlPrefix = _a.getUrlPrefix, onNavClick = _a.onNavClick, collection = _a.collection, user = _a.user, customization = _a.customization, stateful = _a.stateful;
        var _b = this.state, deviceSize = _b.deviceSize, linkTile = _b.linkTile, essence = _b.essence, visualizationStage = _b.visualizationStage, layout = _b.layout;
        if (!linkTile)
            return null;
        var visualization = essence.visualization;
        var visElement = null;
        if (essence.visResolve.isReady() && visualizationStage) {
            var visProps = {
                clicker: clicker,
                timekeeper: timekeeper,
                essence: essence,
                stage: visualizationStage
            };
            visElement = React.createElement(index_3.getVisualizationComponent(visualization), visProps);
        }
        var manualFallback = null;
        if (essence.visResolve.isManual()) {
            manualFallback = React.createElement(index_2.ManualFallback, {
                clicker: clicker,
                essence: essence
            });
        }
        var styles = {
            linkMeasurePanel: { width: layout.linkPanelWidth },
            centerPanel: { left: layout.linkPanelWidth, right: layout.pinboardWidth },
            pinboardPanel: { width: layout.pinboardWidth }
        };
        if (deviceSize === 'small') {
            styles = {
                linkMeasurePanel: { width: 200 },
                centerPanel: { left: 200, right: 200 },
                pinboardPanel: { width: 200 }
            };
        }
        return React.createElement("div", {className: 'link-view'}, 
            React.createElement(link_header_bar_1.LinkHeaderBar, {title: collection.title, user: user, onNavClick: onNavClick, onExploreClick: this.goToCubeView.bind(this), getUrlPrefix: getUrlPrefix, customization: customization, changeTimezone: this.changeTimezone.bind(this), timezone: essence.timezone, stateful: stateful}), 
            React.createElement("div", {className: "container", ref: 'container'}, 
                this.renderLinkPanel(styles.linkMeasurePanel), 
                deviceSize !== 'small' ? React.createElement(index_2.ResizeHandle, {side: "left", initialValue: layout.linkPanelWidth, onResize: this.onLinkPanelResize.bind(this), onResizeEnd: this.onPanelResizeEnd.bind(this), min: MIN_PANEL_WIDTH, max: MAX_PANEL_WIDTH}) : null, 
                React.createElement("div", {className: 'center-panel', style: styles.centerPanel}, 
                    React.createElement("div", {className: 'center-top-bar'}, 
                        React.createElement("div", {className: 'link-title'}, linkTile.title), 
                        React.createElement("div", {className: 'link-description'}, linkTile.description), 
                        React.createElement("div", {className: "right-align"}, this.renderPresets())), 
                    React.createElement("div", {className: 'center-main'}, 
                        React.createElement("div", {className: 'visualization', ref: 'visualization'}, visElement), 
                        manualFallback)), 
                deviceSize !== 'small' ? React.createElement(index_2.ResizeHandle, {side: "right", initialValue: layout.pinboardWidth, onResize: this.onPinboardPanelResize.bind(this), onResizeEnd: this.onPanelResizeEnd.bind(this), min: MIN_PANEL_WIDTH, max: MAX_PANEL_WIDTH}) : null, 
                React.createElement(index_2.PinboardPanel, {style: styles.pinboardPanel, clicker: clicker, essence: essence, timekeeper: timekeeper, getUrlPrefix: getUrlPrefix})));
    };
    return LinkView;
}(React.Component));
exports.LinkView = LinkView;
