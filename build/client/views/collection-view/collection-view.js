"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./collection-view.css');
var React = require('react');
var index_1 = require('../../../common/models/index');
var constants_1 = require('../../config/constants');
var url_1 = require('../../utils/url/url');
var array_1 = require('../../../common/utils/array/array');
var index_2 = require('../../components/index');
var collection_header_bar_1 = require('./collection-header-bar/collection-header-bar');
var collection_overview_1 = require('./collection-overview/collection-overview');
var collection_tile_lightbox_1 = require('./collection-tile-lightbox/collection-tile-lightbox');
var CollectionView = (function (_super) {
    __extends(CollectionView, _super);
    function CollectionView() {
        _super.call(this);
        this.state = {};
    }
    CollectionView.prototype.onURLChange = function (crumbs) {
        var collections = this.props.collections;
        var collection;
        if (crumbs.length === 0) {
            collection = collections[0];
            url_1.replaceHash("#collection/" + collection.name);
        }
        else {
            collection = collections.filter(function (_a) {
                var name = _a.name;
                return name === crumbs[0];
            })[0];
        }
        this.setState({
            collection: collection,
            editingOverview: false
        });
    };
    CollectionView.prototype.onTilesReorder = function (oldIndex, newIndex) {
        var tempCollection = this.state.tempCollection;
        var tiles = tempCollection.tiles.concat();
        array_1.move(tiles, oldIndex, newIndex);
        this.setState({
            tempCollection: tempCollection.changeTiles(tiles)
        });
    };
    CollectionView.prototype.onTilesDelete = function (collection, tile) {
        var tempCollection = this.state.tempCollection;
        this.setState({
            tempCollection: tempCollection.deleteTile(tile)
        });
    };
    CollectionView.prototype.editCollection = function () {
        this.setState({
            editingOverview: true,
            tempCollection: new index_1.Collection(this.state.collection.valueOf())
        });
        this.stickerId = index_2.Notifier.stick(constants_1.STRINGS.dragToReorder);
    };
    CollectionView.prototype.onCollectionTitleChange = function (newTitle) {
        this.setState({
            tempCollection: this.state.tempCollection.changeTitle(newTitle)
        });
    };
    CollectionView.prototype.saveEdition = function () {
        var _this = this;
        index_2.Notifier.removeSticker(this.stickerId);
        var delegate = this.props.delegate;
        var tempCollection = this.state.tempCollection;
        delegate
            .updateCollection(tempCollection)
            .then(function () {
            index_2.Notifier.success('Collection saved');
            _this.setState({
                editingOverview: false,
                tempCollection: null,
                collection: tempCollection
            });
        });
    };
    CollectionView.prototype.cancelEdition = function () {
        index_2.Notifier.removeSticker(this.stickerId);
        this.setState({
            editingOverview: false,
            tempCollection: null
        });
    };
    CollectionView.prototype.render = function () {
        var _a = this.props, user = _a.user, collections = _a.collections, timekeeper = _a.timekeeper, customization = _a.customization, onNavClick = _a.onNavClick, delegate = _a.delegate, dataCubes = _a.dataCubes;
        var _b = this.state, collection = _b.collection, tempCollection = _b.tempCollection, editingOverview = _b.editingOverview;
        var currentCollection = tempCollection || collection;
        var removeCollection = function () { return delegate.deleteCollection(collection); };
        return React.createElement("div", {className: "collection-view"}, 
            React.createElement(collection_header_bar_1.CollectionHeaderBar, {user: user, onNavClick: onNavClick, customization: customization, title: currentCollection ? currentCollection.title : '', dataCubes: dataCubes, collections: collections, onAddItem: delegate ? delegate.createTile.bind(this, collection) : null, onEditCollection: delegate ? this.editCollection.bind(this) : null, onDeleteCollection: delegate ? removeCollection : null, editionMode: editingOverview, onSave: this.saveEdition.bind(this), onCancel: this.cancelEdition.bind(this), onCollectionTitleChange: this.onCollectionTitleChange.bind(this)}), 
            React.createElement("div", {className: "main-panel"}, 
                React.createElement(index_2.Router, {onURLChange: this.onURLChange.bind(this), rootFragment: "collection"}, 
                    React.createElement(index_2.Route, {fragment: ":collectionId", alwaysShowOrphans: true}, 
                        React.createElement(collection_overview_1.CollectionOverview, {collection: currentCollection, timekeeper: timekeeper, editionMode: editingOverview, onReorder: this.onTilesReorder.bind(this), onDelete: this.onTilesDelete.bind(this)}), 
                        React.createElement(index_2.Route, {fragment: ":tileId"}, 
                            React.createElement(collection_tile_lightbox_1.CollectionTileLightbox, {collection: currentCollection, timekeeper: timekeeper, onChange: delegate ? delegate.updateTile : null, onEdit: delegate ? delegate.editTile : null, onDelete: delegate ? delegate.deleteTile : null, onDuplicate: delegate ? delegate.duplicateTile : null})
                        ))
                )
            ));
    };
    return CollectionView;
}(React.Component));
exports.CollectionView = CollectionView;
