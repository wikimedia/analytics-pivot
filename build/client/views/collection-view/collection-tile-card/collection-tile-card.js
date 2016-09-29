"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./collection-tile-card.css');
var React = require('react');
var ReactDOM = require('react-dom');
var index_1 = require('../../../components/index');
var dom_1 = require('../../../utils/dom/dom');
var index_2 = require('../../../../common/models/index');
var index_3 = require('../../../visualizations/index');
var CollectionTileCard = (function (_super) {
    __extends(CollectionTileCard, _super);
    function CollectionTileCard() {
        _super.call(this);
        this.state = {};
    }
    CollectionTileCard.prototype.componentDidMount = function () {
        this.updateVisualizationStage();
    };
    CollectionTileCard.prototype.updateVisualizationStage = function () {
        var visualization = this.refs.visualization;
        var visualizationDOM = ReactDOM.findDOMNode(visualization);
        if (!visualizationDOM)
            return;
        this.setState({
            deviceSize: index_2.Device.getSize(),
            visualizationStage: index_2.Stage.fromClientRect(visualizationDOM.getBoundingClientRect())
        });
    };
    CollectionTileCard.prototype.expand = function () {
        var _a = this.props, onExpand = _a.onExpand, tile = _a.tile;
        if (!onExpand)
            return;
        onExpand(tile);
    };
    CollectionTileCard.prototype.remove = function () {
        var _a = this.props, onDelete = _a.onDelete, tile = _a.tile;
        if (!onDelete)
            return;
        onDelete(tile);
    };
    CollectionTileCard.prototype.render = function () {
        var _this = this;
        var _a = this.props, tile = _a.tile, timekeeper = _a.timekeeper, onDragOver = _a.onDragOver, draggable = _a.draggable, onDragStart = _a.onDragStart, editionMode = _a.editionMode, className = _a.className;
        var _b = this.state, visualizationStage = _b.visualizationStage, deviceSize = _b.deviceSize;
        if (!tile)
            return null;
        var essence = tile.essence;
        var visElement = null;
        if (essence.visResolve.isReady() && visualizationStage) {
            if (essence.getEffectiveMultiMeasureMode()) {
                essence = essence.toggleMultiMeasureMode();
            }
            var visProps = {
                clicker: {},
                essence: essence,
                timekeeper: timekeeper,
                stage: visualizationStage,
                deviceSize: deviceSize,
                isThumbnail: true
            };
            visElement = React.createElement(index_3.getVisualizationComponent(essence.visualization), visProps);
        }
        var onExpandClick = function () {
            if (editionMode)
                return;
            _this.expand();
        };
        return React.createElement("div", {className: dom_1.classNames("collection-tile-card", { editing: editionMode }, className), onDragOver: onDragOver, draggable: draggable, onDragStart: onDragStart}, 
            React.createElement(index_1.GlobalEventListener, {resize: this.updateVisualizationStage.bind(this)}), 
            React.createElement("div", {className: "headband grid-row", onClick: onExpandClick}, 
                React.createElement("div", {className: "grid-col-80 vertical"}, 
                    React.createElement("div", {className: "title"}, tile.title), 
                    React.createElement("div", {className: "description"}, tile.description)), 
                React.createElement("div", {className: "grid-col-20 middle right"}, editionMode ?
                    React.createElement("div", {className: "delete-button", onClick: this.remove.bind(this)}, 
                        React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-delete.svg")})
                    )
                    :
                        React.createElement("div", {className: "expand-button"}, 
                            React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-expand.svg")})
                        ))), 
            React.createElement("div", {className: "content", ref: "visualization"}, visElement));
    };
    return CollectionTileCard;
}(React.Component));
exports.CollectionTileCard = CollectionTileCard;
