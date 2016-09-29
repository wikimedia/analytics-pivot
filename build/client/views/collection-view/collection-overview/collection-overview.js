"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./collection-overview.css');
var React = require('react');
var index_1 = require('../../../components/index');
var collection_tile_card_1 = require('../collection-tile-card/collection-tile-card');
var dom_1 = require('../../../utils/dom/dom');
var CollectionOverview = (function (_super) {
    __extends(CollectionOverview, _super);
    function CollectionOverview() {
        _super.call(this);
        this.state = {
            dropIndex: -1
        };
    }
    CollectionOverview.prototype.onExpand = function (tile) {
        window.location.hash = "#collection/" + this.props.collection.name + "/" + tile.name;
    };
    CollectionOverview.prototype.dragStart = function (tile, e) {
        this.setState({ draggedTile: tile });
        var dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData("text/html", tile.title);
        dom_1.setDragGhost(dataTransfer, tile.title);
    };
    CollectionOverview.prototype.shouldDropAfter = function (e) {
        var targetRect = e.currentTarget.getBoundingClientRect();
        return dom_1.getXFromEvent(e) - targetRect.left >= targetRect.width / 2;
    };
    CollectionOverview.prototype.dragOver = function (tile, e) {
        e.preventDefault();
        var collection = this.props.collection;
        var _a = this.state, draggedTile = _a.draggedTile, dropIndex = _a.dropIndex, dropAfter = _a.dropAfter;
        var tiles = collection.tiles;
        if (dropIndex === -1 && tile === draggedTile)
            return;
        var sourceIndex = tiles.indexOf(draggedTile);
        var targetIndex = tiles.indexOf(tile);
        var newDropIndex = targetIndex;
        var shouldDropAfter = this.shouldDropAfter(e);
        if (newDropIndex === sourceIndex) {
            newDropIndex = -1;
        }
        if (newDropIndex === sourceIndex + 1 && !shouldDropAfter) {
            newDropIndex = -1;
        }
        if (newDropIndex === sourceIndex - 1 && shouldDropAfter) {
            newDropIndex = -1;
        }
        if (newDropIndex !== dropIndex || shouldDropAfter !== dropAfter) {
            this.setState({
                dropIndex: newDropIndex,
                dropAfter: shouldDropAfter
            });
        }
    };
    CollectionOverview.prototype.dragEnd = function (e) {
        var _a = this.props, onReorder = _a.onReorder, collection = _a.collection;
        var _b = this.state, draggedTile = _b.draggedTile, dropIndex = _b.dropIndex, dropAfter = _b.dropAfter;
        dropIndex = dropAfter || dropIndex === 0 ? dropIndex : dropIndex - 1;
        if (dropIndex > -1)
            onReorder(collection.tiles.indexOf(draggedTile), dropIndex);
        this.setState({
            draggedTile: undefined,
            dropIndex: -1,
            dropAfter: undefined
        });
    };
    CollectionOverview.prototype.renderTile = function (tile, i) {
        var _a = this.props, timekeeper = _a.timekeeper, editionMode = _a.editionMode, onDelete = _a.onDelete, collection = _a.collection;
        var _b = this.state, draggedTile = _b.draggedTile, dropIndex = _b.dropIndex, dropAfter = _b.dropAfter;
        var onDeleteClick = function (tile) { return onDelete(collection, tile); };
        var classes = dom_1.classNames({
            dragged: draggedTile === tile,
            'drop-before': dropIndex === i && !dropAfter,
            'drop-after': dropIndex === i && dropAfter
        });
        return React.createElement(collection_tile_card_1.CollectionTileCard, {className: classes, tile: tile, timekeeper: timekeeper, key: tile.name, onExpand: this.onExpand.bind(this), onDragOver: this.dragOver.bind(this, tile), draggable: editionMode, onDragStart: this.dragStart.bind(this, tile), onDelete: onDeleteClick, editionMode: editionMode});
    };
    CollectionOverview.prototype.renderEmpty = function () {
        return React.createElement("div", {className: "collection-overview empty"}, 
            React.createElement("div", {className: "container"}, 
                React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-collection.svg")}), 
                React.createElement("div", {className: "placeholder"}, "There are no views in this collection"))
        );
    };
    CollectionOverview.prototype.render = function () {
        var collection = this.props.collection;
        if (!collection)
            return null;
        if (!collection.tiles.length)
            return this.renderEmpty();
        return React.createElement("div", {className: "collection-overview", onDragEnd: this.dragEnd.bind(this)}, 
            collection.tiles.map(this.renderTile, this), 
            React.createElement("div", {className: "collection-tile-card empty"}));
    };
    return CollectionOverview;
}(React.Component));
exports.CollectionOverview = CollectionOverview;
