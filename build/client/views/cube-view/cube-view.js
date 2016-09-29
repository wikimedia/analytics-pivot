"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./cube-view.css');
var React = require('react');
var ReactDOM = require('react-dom');
var drag_manager_1 = require('../../utils/drag-manager/drag-manager');
var index_1 = require('../../../common/models/index');
var index_2 = require('../../../common/manifests/index');
var index_3 = require('../../components/index');
var supervised_cube_header_bar_1 = require('./supervised-cube-header-bar/supervised-cube-header-bar');
var cube_header_bar_1 = require('./cube-header-bar/cube-header-bar');
var index_4 = require('../../visualizations/index');
var localStorage = require('../../utils/local-storage/local-storage');
var MIN_PANEL_WIDTH = 240;
var MAX_PANEL_WIDTH = 400;
var CubeView = (function (_super) {
    __extends(CubeView, _super);
    function CubeView() {
        var _this = this;
        _super.call(this);
        this.state = {
            essence: null,
            dragOver: false,
            showRawDataModal: false,
            layout: this.getStoredLayout(),
            updatingMaxTime: false
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
            changeSplits: function (splits, strategy, colors) {
                var essence = _this.state.essence;
                if (colors)
                    essence = essence.changeColors(colors);
                _this.setState({ essence: essence.changeSplits(splits, strategy) });
            },
            changeSplit: function (split, strategy) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changeSplit(split, strategy) });
            },
            addSplit: function (split, strategy) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.addSplit(split, strategy) });
            },
            removeSplit: function (split, strategy) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.removeSplit(split, strategy) });
            },
            changeColors: function (colors) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changeColors(colors) });
            },
            changeVisualization: function (visualization) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changeVisualization(visualization) });
            },
            pin: function (dimension) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.pin(dimension) });
            },
            unpin: function (dimension) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.unpin(dimension) });
            },
            changePinnedSortMeasure: function (measure) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.changePinnedSortMeasure(measure) });
            },
            toggleMultiMeasureMode: function () {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.toggleMultiMeasureMode() });
            },
            toggleEffectiveMeasure: function (measure) {
                var essence = _this.state.essence;
                _this.setState({ essence: essence.toggleEffectiveMeasure(measure) });
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
    }
    CubeView.prototype.refreshMaxTime = function () {
        var _this = this;
        var _a = this.state, essence = _a.essence, timekeeper = _a.timekeeper;
        var dataCube = essence.dataCube;
        this.setState({ updatingMaxTime: true });
        index_1.DataCube.queryMaxTime(dataCube)
            .then(function (updatedMaxTime) {
            if (!_this.mounted)
                return;
            _this.setState({
                timekeeper: timekeeper.updateTime(dataCube.name, updatedMaxTime),
                updatingMaxTime: false
            });
        });
    };
    CubeView.prototype.componentWillMount = function () {
        var _a = this.props, hash = _a.hash, dataCube = _a.dataCube, updateViewHash = _a.updateViewHash, initTimekeeper = _a.initTimekeeper;
        var essence = this.getEssenceFromHash(dataCube, hash);
        if (!essence) {
            if (!dataCube)
                throw new Error('must have data cube');
            essence = this.getEssenceFromDataCube(dataCube);
            updateViewHash(essence.toHash(), true);
        }
        this.setState({
            essence: essence,
            timekeeper: initTimekeeper || index_1.Timekeeper.EMPTY
        });
    };
    CubeView.prototype.componentDidMount = function () {
        var _this = this;
        var transitionFnSlot = this.props.transitionFnSlot;
        this.mounted = true;
        drag_manager_1.DragManager.init();
        this.globalResizeListener();
        if (transitionFnSlot) {
            transitionFnSlot.fill(function (oldDataCube, newDataCube) {
                if (!index_1.DataCube.isDataCube(oldDataCube))
                    return null;
                if (!index_1.DataCube.isDataCube(newDataCube))
                    return null;
                if (newDataCube === oldDataCube || !newDataCube.sameGroup(oldDataCube))
                    return null;
                var essence = _this.state.essence;
                if (!essence)
                    return null;
                return '#' + newDataCube.name + '/' + essence.updateDataCube(newDataCube).toHash();
            });
        }
        require.ensure(['../../modals/raw-data-modal/raw-data-modal'], function (require) {
            _this.setState({
                RawDataModalAsync: require('../../modals/raw-data-modal/raw-data-modal').RawDataModal
            });
        }, 'raw-data-modal');
    };
    CubeView.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props, hash = _a.hash, dataCube = _a.dataCube, updateViewHash = _a.updateViewHash;
        if (!nextProps.dataCube)
            throw new Error('must have data cube');
        if (dataCube.name !== nextProps.dataCube.name || hash !== nextProps.hash) {
            var hashEssence = this.getEssenceFromHash(nextProps.dataCube, nextProps.hash);
            if (!hashEssence) {
                hashEssence = this.getEssenceFromDataCube(nextProps.dataCube);
                updateViewHash(hashEssence.toHash(), true);
            }
            this.setState({ essence: hashEssence });
        }
    };
    CubeView.prototype.componentWillUpdate = function (nextProps, nextState) {
        var updateViewHash = this.props.updateViewHash;
        var essence = this.state.essence;
        if (updateViewHash && !nextState.essence.equals(essence)) {
            updateViewHash(nextState.essence.toHash());
        }
    };
    CubeView.prototype.componentWillUnmount = function () {
        var transitionFnSlot = this.props.transitionFnSlot;
        this.mounted = false;
        if (transitionFnSlot)
            transitionFnSlot.clear();
    };
    CubeView.prototype.getEssenceFromDataCube = function (dataCube) {
        var essence = index_1.Essence.fromDataCube(dataCube, { dataCube: dataCube, visualizations: index_2.MANIFESTS });
        var isMulti = !!localStorage.get('is-multi-measure');
        return essence.multiMeasureMode !== isMulti ? essence.toggleMultiMeasureMode() : essence;
    };
    CubeView.prototype.getEssenceFromHash = function (dataCube, hash) {
        if (!dataCube || !hash)
            return null;
        return index_1.Essence.fromHash(hash, { dataCube: dataCube, visualizations: index_2.MANIFESTS });
    };
    CubeView.prototype.globalResizeListener = function () {
        var _a = this.refs, container = _a.container, visualization = _a.visualization;
        var containerDOM = ReactDOM.findDOMNode(container);
        var visualizationDOM = ReactDOM.findDOMNode(visualization);
        if (!containerDOM || !visualizationDOM)
            return;
        this.setState({
            deviceSize: index_1.Device.getSize(),
            menuStage: index_1.Stage.fromClientRect(containerDOM.getBoundingClientRect()),
            visualizationStage: index_1.Stage.fromClientRect(visualizationDOM.getBoundingClientRect())
        });
    };
    CubeView.prototype.canDrop = function (e) {
        return Boolean(drag_manager_1.DragManager.getDragDimension());
    };
    CubeView.prototype.dragEnter = function (e) {
        if (!this.canDrop(e))
            return;
        e.preventDefault();
        this.setState({ dragOver: true });
    };
    CubeView.prototype.dragOver = function (e) {
        if (!this.canDrop(e))
            return;
        e.dataTransfer.dropEffect = 'move';
        e.preventDefault();
    };
    CubeView.prototype.dragLeave = function (e) {
        this.setState({ dragOver: false });
    };
    CubeView.prototype.drop = function (e) {
        if (!this.canDrop(e))
            return;
        e.preventDefault();
        var dimension = drag_manager_1.DragManager.getDragDimension();
        if (dimension) {
            this.clicker.changeSplit(index_1.SplitCombine.fromExpression(dimension.expression), index_1.VisStrategy.FairGame);
        }
        this.setState({ dragOver: false });
    };
    CubeView.prototype.openRawDataModal = function () {
        this.setState({
            showRawDataModal: true
        });
    };
    CubeView.prototype.onRawDataModalClose = function () {
        this.setState({
            showRawDataModal: false
        });
    };
    CubeView.prototype.renderRawDataModal = function () {
        var _a = this.state, RawDataModalAsync = _a.RawDataModalAsync, showRawDataModal = _a.showRawDataModal, essence = _a.essence, timekeeper = _a.timekeeper;
        if (!RawDataModalAsync || !showRawDataModal)
            return null;
        return React.createElement(RawDataModalAsync, {essence: essence, timekeeper: timekeeper, onClose: this.onRawDataModalClose.bind(this)});
    };
    CubeView.prototype.triggerFilterMenu = function (dimension) {
        if (!dimension)
            return;
        this.refs['filterTile'].filterMenuRequest(dimension);
    };
    CubeView.prototype.triggerSplitMenu = function (dimension) {
        if (!dimension)
            return;
        this.refs['splitTile'].splitMenuRequest(dimension);
    };
    CubeView.prototype.changeTimezone = function (newTimezone) {
        var essence = this.state.essence;
        var newEssence = essence.changeTimezone(newTimezone);
        this.setState({ essence: newEssence });
    };
    CubeView.prototype.getStoredLayout = function () {
        return localStorage.get('cube-view-layout') || { dimensionPanelWidth: 240, pinboardWidth: 240 };
    };
    CubeView.prototype.storeLayout = function (layout) {
        localStorage.set('cube-view-layout', layout);
    };
    CubeView.prototype.onDimensionPanelResize = function (value) {
        var layout = this.state.layout;
        layout.dimensionPanelWidth = value;
        this.setState({ layout: layout });
        this.storeLayout(layout);
    };
    CubeView.prototype.onPinboardPanelResize = function (value) {
        var layout = this.state.layout;
        layout.pinboardWidth = value;
        this.setState({ layout: layout });
        this.storeLayout(layout);
    };
    CubeView.prototype.onPanelResizeEnd = function () {
        this.globalResizeListener();
    };
    CubeView.prototype.onAddEssenceToCollection = function () {
        this.props.addEssenceToCollection(this.state.essence);
    };
    CubeView.prototype.render = function () {
        var _this = this;
        var clicker = this.clicker;
        var _a = this.props, getUrlPrefix = _a.getUrlPrefix, onNavClick = _a.onNavClick, user = _a.user, customization = _a.customization, supervisor = _a.supervisor, stateful = _a.stateful;
        var _b = this.state, deviceSize = _b.deviceSize, layout = _b.layout, essence = _b.essence, timekeeper = _b.timekeeper, menuStage = _b.menuStage, visualizationStage = _b.visualizationStage, dragOver = _b.dragOver, updatingMaxTime = _b.updatingMaxTime;
        if (!essence)
            return null;
        var visualization = essence.visualization;
        var visElement = null;
        if (essence.visResolve.isReady() && visualizationStage) {
            var visProps = {
                clicker: clicker,
                timekeeper: timekeeper,
                essence: essence,
                stage: visualizationStage,
                deviceSize: deviceSize,
                openRawDataModal: this.openRawDataModal.bind(this),
                registerDownloadableDataset: function (dataset) { _this.downloadableDataset = dataset; }
            };
            visElement = React.createElement(index_4.getVisualizationComponent(visualization), visProps);
        }
        var manualFallback = null;
        if (essence.visResolve.isManual()) {
            manualFallback = React.createElement(index_3.ManualFallback, {
                clicker: clicker,
                essence: essence
            });
        }
        var styles = {
            dimensionMeasurePanel: { width: layout.dimensionPanelWidth },
            centerPanel: { left: layout.dimensionPanelWidth, right: layout.pinboardWidth },
            pinboardPanel: { width: layout.pinboardWidth }
        };
        if (deviceSize === 'small') {
            styles = {
                dimensionMeasurePanel: { width: 200 },
                centerPanel: { left: 200, right: 200 },
                pinboardPanel: { width: 200 }
            };
        }
        var headerBar = React.createElement(cube_header_bar_1.CubeHeaderBar, {clicker: clicker, essence: essence, timekeeper: timekeeper, user: user, onNavClick: onNavClick, getUrlPrefix: getUrlPrefix, refreshMaxTime: this.refreshMaxTime.bind(this), openRawDataModal: this.openRawDataModal.bind(this), customization: customization, getDownloadableDataset: function () { return _this.downloadableDataset; }, changeTimezone: this.changeTimezone.bind(this), timezone: essence.timezone, updatingMaxTime: updatingMaxTime, addEssenceToCollection: this.onAddEssenceToCollection.bind(this), stateful: stateful});
        if (supervisor) {
            headerBar = React.createElement(supervised_cube_header_bar_1.SupervisedCubeHeaderBar, {essence: essence, customization: customization, changeTimezone: this.changeTimezone.bind(this), timezone: essence.timezone, supervisor: supervisor});
        }
        return React.createElement("div", {className: 'cube-view'}, 
            React.createElement(index_3.GlobalEventListener, {resize: this.globalResizeListener.bind(this)}), 
            headerBar, 
            React.createElement("div", {className: "container", ref: 'container'}, 
                React.createElement(index_3.DimensionMeasurePanel, {style: styles.dimensionMeasurePanel, clicker: clicker, essence: essence, menuStage: menuStage, triggerFilterMenu: this.triggerFilterMenu.bind(this), triggerSplitMenu: this.triggerSplitMenu.bind(this), getUrlPrefix: getUrlPrefix}), 
                deviceSize !== 'small' ? React.createElement(index_3.ResizeHandle, {side: "left", initialValue: layout.dimensionPanelWidth, onResize: this.onDimensionPanelResize.bind(this), onResizeEnd: this.onPanelResizeEnd.bind(this), min: MIN_PANEL_WIDTH, max: MAX_PANEL_WIDTH}) : null, 
                React.createElement("div", {className: 'center-panel', style: styles.centerPanel}, 
                    React.createElement("div", {className: 'center-top-bar'}, 
                        React.createElement("div", {className: 'filter-split-section'}, 
                            React.createElement(index_3.FilterTile, {ref: "filterTile", clicker: clicker, essence: essence, timekeeper: timekeeper, menuStage: visualizationStage, getUrlPrefix: getUrlPrefix}), 
                            React.createElement(index_3.SplitTile, {ref: "splitTile", clicker: clicker, essence: essence, menuStage: visualizationStage, getUrlPrefix: getUrlPrefix})), 
                        React.createElement(index_3.VisSelector, {clicker: clicker, essence: essence})), 
                    React.createElement("div", {className: 'center-main', onDragEnter: this.dragEnter.bind(this)}, 
                        React.createElement("div", {className: 'visualization', ref: 'visualization'}, visElement), 
                        manualFallback, 
                        dragOver ? React.createElement(index_3.DropIndicator, null) : null, 
                        dragOver ? React.createElement("div", {className: "drag-mask", onDragOver: this.dragOver.bind(this), onDragLeave: this.dragLeave.bind(this), onDragExit: this.dragLeave.bind(this), onDrop: this.drop.bind(this)}) : null)), 
                deviceSize !== 'small' ? React.createElement(index_3.ResizeHandle, {side: "right", initialValue: layout.pinboardWidth, onResize: this.onPinboardPanelResize.bind(this), onResizeEnd: this.onPanelResizeEnd.bind(this), min: MIN_PANEL_WIDTH, max: MAX_PANEL_WIDTH}) : null, 
                React.createElement(index_3.PinboardPanel, {style: styles.pinboardPanel, clicker: clicker, essence: essence, timekeeper: timekeeper, getUrlPrefix: getUrlPrefix})), 
            this.renderRawDataModal());
    };
    CubeView.defaultProps = {
        maxFilters: 20,
        maxSplits: 3
    };
    return CubeView;
}(React.Component));
exports.CubeView = CubeView;
