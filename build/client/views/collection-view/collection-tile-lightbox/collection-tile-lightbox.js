"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./collection-tile-lightbox.css');
var React = require('react');
var ReactDOM = require('react-dom');
var constants_1 = require('../../../config/constants');
var dom_1 = require('../../../utils/dom/dom');
var index_1 = require('../../../components/index');
var index_2 = require('../../../../common/models/index');
var index_3 = require('../../../visualizations/index');
var CollectionTileLightbox = (function (_super) {
    __extends(CollectionTileLightbox, _super);
    function CollectionTileLightbox() {
        _super.call(this);
        this.state = {};
    }
    CollectionTileLightbox.prototype.componentWillReceiveProps = function (nextProps) {
        var collection = nextProps.collection, tileId = nextProps.tileId;
        if (collection) {
            var tile = collection.tiles.filter(function (_a) {
                var name = _a.name;
                return tileId === name;
            })[0];
            this.setState({
                tile: tile
            });
        }
    };
    CollectionTileLightbox.prototype.updateStage = function () {
        var visualization = this.refs.visualization;
        var visualizationDOM = ReactDOM.findDOMNode(visualization);
        if (!visualizationDOM)
            return;
        this.setState({
            visualizationStage: index_2.Stage.fromClientRect(visualizationDOM.getBoundingClientRect())
        });
    };
    CollectionTileLightbox.prototype.onExplore = function () {
        var essence = this.state.tile.essence;
        window.location.hash = '#' + essence.getURL(essence.dataCube.name + '/');
    };
    CollectionTileLightbox.prototype.onEditIconClick = function () {
        this.setState({
            editMenuOpen: !this.state.editMenuOpen,
            moreMenuOpen: false
        });
    };
    CollectionTileLightbox.prototype.onMoreIconClick = function () {
        this.setState({
            moreMenuOpen: !this.state.moreMenuOpen,
            editMenuOpen: false
        });
    };
    CollectionTileLightbox.prototype.closeModal = function () {
        window.location.hash = "#collection/" + this.props.collection.name;
    };
    CollectionTileLightbox.prototype.onEscape = function () {
        if (this.state.editionMode) {
            this.setState({
                editionMode: false,
                tempTile: null
            });
            return;
        }
        if (this.state.editMenuOpen)
            return;
        this.closeModal();
    };
    CollectionTileLightbox.prototype.editTitleAndDesc = function () {
        this.setState({
            editMenuOpen: false,
            editionMode: true,
            tempTile: new index_2.CollectionTile(this.state.tile.valueOf())
        });
    };
    CollectionTileLightbox.prototype.renderEditMenu = function () {
        var _this = this;
        var _a = this.props, onEdit = _a.onEdit, collection = _a.collection;
        var tile = this.state.tile;
        var onClose = function () { return _this.setState({ editMenuOpen: false }); };
        var edit = function () { return onEdit(collection, tile); };
        return React.createElement(index_1.BubbleMenu, {className: "edit-menu", direction: "down", stage: index_2.Stage.fromSize(200, 200), openOn: this.refs['edit-button'], onClose: onClose}, 
            React.createElement("ul", {className: "bubble-list"}, 
                React.createElement("li", {className: "edit-title-and-desc", onClick: this.editTitleAndDesc.bind(this)}, constants_1.STRINGS.editTitleAndDesc), 
                React.createElement("li", {className: "edit-vizualization", onClick: edit}, constants_1.STRINGS.editVisualization))
        );
    };
    CollectionTileLightbox.prototype.renderMoreMenu = function () {
        var _this = this;
        var _a = this.props, onDelete = _a.onDelete, collection = _a.collection, onDuplicate = _a.onDuplicate;
        var tile = this.state.tile;
        var onClose = function () { return _this.setState({ moreMenuOpen: false }); };
        var remove = function () { return onDelete(collection, tile); };
        var duplicate = function () {
            onDuplicate(collection, tile).then(function (url) {
                window.location.hash = url;
                onClose();
                index_1.Notifier.success('Tile duplicated');
            });
        };
        return React.createElement(index_1.BubbleMenu, {className: "more-menu", direction: "down", stage: index_2.Stage.fromSize(200, 200), openOn: this.refs['more-button'], onClose: onClose}, 
            React.createElement("ul", {className: "bubble-list"}, 
                React.createElement("li", {className: "duplicate-tile", onClick: duplicate}, constants_1.STRINGS.duplicateCollectionTile), 
                React.createElement("li", {className: "delete-tile", onClick: remove}, constants_1.STRINGS.deleteCollectionTile))
        );
    };
    CollectionTileLightbox.prototype.onMouseDown = function (e) {
        var _a = this.state, editMenuOpen = _a.editMenuOpen, moreMenuOpen = _a.moreMenuOpen;
        var target = e.target;
        var modal = this.refs['modal'];
        var leftArrow = this.refs['left-arrow'];
        var rightArrow = this.refs['right-arrow'];
        if (dom_1.isInside(target, modal))
            return;
        if (dom_1.isInside(target, leftArrow))
            return;
        if (dom_1.isInside(target, rightArrow))
            return;
        if (editMenuOpen || moreMenuOpen)
            return;
        this.closeModal();
    };
    CollectionTileLightbox.prototype.swipe = function (direction) {
        var collection = this.props.collection;
        var tile = this.state.tile;
        var tiles = collection.tiles;
        var newIndex = tiles.indexOf(tile) + direction;
        if (newIndex >= tiles.length)
            newIndex = 0;
        if (newIndex < 0)
            newIndex = tiles.length - 1;
        window.location.hash = "#collection/" + collection.name + "/" + tiles[newIndex].name;
    };
    CollectionTileLightbox.prototype.onEnter = function () {
        if (this.state.editionMode)
            this.saveEdition();
    };
    CollectionTileLightbox.prototype.saveEdition = function () {
        var _this = this;
        var collection = this.props.collection;
        var tempTile = this.state.tempTile;
        this.props.onChange(collection, tempTile).then(function () {
            _this.setState({
                tile: tempTile,
                tempTile: null,
                editionMode: false
            });
        });
    };
    CollectionTileLightbox.prototype.renderHeadBand = function () {
        var _this = this;
        var onEdit = this.props.onEdit;
        var _a = this.state, editionMode = _a.editionMode, tempTile = _a.tempTile, tile = _a.tile, editMenuOpen = _a.editMenuOpen, moreMenuOpen = _a.moreMenuOpen;
        var editButton = null;
        var moreButton = null;
        if (onEdit) {
            editButton = React.createElement("div", {className: dom_1.classNames('edit-button icon', { active: editMenuOpen }), onClick: this.onEditIconClick.bind(this), ref: "edit-button"}, 
                React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-edit.svg")})
            );
            moreButton = React.createElement("div", {className: dom_1.classNames('more-button icon', { active: moreMenuOpen }), onClick: this.onMoreIconClick.bind(this), ref: "more-button"}, 
                React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-more.svg")})
            );
        }
        if (!editionMode) {
            return React.createElement("div", {className: "headband grid-row"}, 
                React.createElement("div", {className: "grid-col-70 vertical"}, 
                    React.createElement("div", {className: "title actionable", onClick: this.editTitleAndDesc.bind(this)}, tile.title), 
                    React.createElement("div", {className: "description actionable", onClick: this.editTitleAndDesc.bind(this)}, tile.description)), 
                React.createElement("div", {className: "grid-col-30 right middle"}, 
                    React.createElement("div", {className: "explore-button", onClick: this.onExplore.bind(this)}, constants_1.STRINGS.explore), 
                    editButton, 
                    moreButton, 
                    React.createElement("div", {className: "separator"}), 
                    React.createElement("div", {className: "close-button icon", onClick: this.closeModal.bind(this)}, 
                        React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-remove.svg")})
                    )));
        }
        var onChange = function (newItem) {
            _this.setState({ tempTile: newItem });
        };
        var makeTextInput = index_1.ImmutableInput.simpleGenerator(tempTile, onChange);
        var cancel = function () {
            _this.setState({
                editionMode: false,
                tempTile: null
            });
        };
        return React.createElement("div", {className: "headband grid-row"}, 
            React.createElement("div", {className: "grid-col-70 vertical enable-overflow"}, 
                makeTextInput('title', /.*/, true), 
                makeTextInput('description')), 
            React.createElement("div", {className: "grid-col-30 right middle"}, 
                React.createElement("div", {className: "cancel-button", onClick: cancel}, constants_1.STRINGS.cancel), 
                React.createElement("div", {className: "save-button", onClick: this.saveEdition.bind(this)}, constants_1.STRINGS.save)));
    };
    CollectionTileLightbox.prototype.render = function () {
        var timekeeper = this.props.timekeeper;
        var _a = this.state, tile = _a.tile, visualizationStage = _a.visualizationStage, editMenuOpen = _a.editMenuOpen, moreMenuOpen = _a.moreMenuOpen;
        if (!tile)
            return null;
        var essence = tile.essence;
        var visElement = null;
        if (essence.visResolve.isReady() && visualizationStage) {
            var visProps = {
                clicker: {},
                essence: essence,
                timekeeper: timekeeper,
                stage: visualizationStage
            };
            visElement = React.createElement(index_3.getVisualizationComponent(essence.visualization), visProps);
        }
        return React.createElement(index_1.BodyPortal, {fullSize: true, onMount: this.updateStage.bind(this)}, 
            React.createElement("div", {className: "collection-tile-lightbox"}, 
                React.createElement(index_1.GlobalEventListener, {resize: this.updateStage.bind(this), escape: this.onEscape.bind(this), enter: this.onEnter.bind(this), mouseDown: this.onMouseDown.bind(this), left: this.swipe.bind(this, -1), right: this.swipe.bind(this, 1)}), 
                React.createElement("div", {className: "backdrop"}), 
                React.createElement(index_1.GoldenCenter, null, 
                    React.createElement("div", {className: "modal-window", ref: "modal"}, 
                        this.renderHeadBand(), 
                        React.createElement("div", {className: "content", ref: "visualization"}, visElement))
                ), 
                React.createElement("div", {className: "left-arrow", onClick: this.swipe.bind(this, -1), ref: "left-arrow"}, 
                    React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-caret-left-line.svg")})
                ), 
                React.createElement("div", {className: "right-arrow", onClick: this.swipe.bind(this, 1), ref: "right-arrow"}, 
                    React.createElement(index_1.SvgIcon, {svg: require("../../../icons/full-caret-right-line.svg")})
                ), 
                editMenuOpen ? this.renderEditMenu() : null, 
                moreMenuOpen ? this.renderMoreMenu() : null)
        );
    };
    return CollectionTileLightbox;
}(React.Component));
exports.CollectionTileLightbox = CollectionTileLightbox;
