"use strict";
var React = require('react');
var Q = require('q');
var ajax_1 = require('../../../utils/ajax/ajax');
var index_1 = require('../../../../common/models/index');
var string_1 = require('../../../../common/utils/string/string');
var constants_1 = require('../../../config/constants');
var index_2 = require('../../../modals/index');
var index_3 = require('../../../components/index');
var CollectionViewDelegate = (function () {
    function CollectionViewDelegate(app) {
        this.app = app;
        this.addCollection = this.addCollection.bind(this);
        this.addTile = this.addTile.bind(this);
        this.createTile = this.createTile.bind(this);
        this.deleteCollection = this.deleteCollection.bind(this);
        this.deleteTile = this.deleteTile.bind(this);
        this.duplicateTile = this.duplicateTile.bind(this);
        this.editTile = this.editTile.bind(this);
        this.updateCollection = this.updateCollection.bind(this);
        this.updateTile = this.updateTile.bind(this);
    }
    CollectionViewDelegate.prototype.setState = function (state, callback) {
        return this.app.setState.call(this.app, state, callback);
    };
    CollectionViewDelegate.prototype.save = function (appSettings) {
        var _this = this;
        var deferred = Q.defer();
        ajax_1.Ajax.query({
            method: "POST",
            url: 'collections',
            data: {
                collections: appSettings.toJS().collections || []
            }
        })
            .then(function (status) { return _this.setState({ appSettings: appSettings }, deferred.resolve); }, function (xhr) {
            index_3.Notifier.failure('Woops', 'Something bad happened');
            deferred.reject(xhr.response);
        }).done();
        return deferred.promise;
    };
    CollectionViewDelegate.prototype.getSettings = function () {
        return this.app.state.appSettings;
    };
    CollectionViewDelegate.prototype.getTimekeeper = function () {
        return this.app.state.timekeeper;
    };
    CollectionViewDelegate.prototype.addCollection = function (collection) {
        return this
            .save(this.getSettings().addOrUpdateCollection(collection))
            .then(function () { return ("#collection/" + collection.name); });
    };
    CollectionViewDelegate.prototype.deleteTile = function (collection, tile) {
        var _this = this;
        var appSettings = this.getSettings();
        var collectionURL = "#collection/" + collection.name;
        var oldIndex = collection.tiles.indexOf(tile);
        var newCollection = collection.deleteTile(tile);
        var newSettings = appSettings.addOrUpdateCollection(newCollection);
        var undo = function () { return _this.addTile(newCollection, tile, oldIndex); };
        this.save(newSettings).then(function () {
            window.location.hash = collectionURL;
            index_3.Notifier.success('Tile removed', { label: constants_1.STRINGS.undo, callback: undo });
        });
    };
    CollectionViewDelegate.prototype.addTile = function (collection, tile, index) {
        var appSettings = this.getSettings();
        var newTiles = collection.tiles;
        if (index !== undefined) {
            newTiles.splice(index, 0, tile);
        }
        else {
            newTiles.push(tile);
        }
        return this
            .save(appSettings.addOrUpdateCollection(collection.changeTiles(newTiles)))
            .then(function () { return ("#collection/" + collection.name + "/" + tile.name); });
    };
    CollectionViewDelegate.prototype.duplicateTile = function (collection, tile) {
        var newTile = new index_1.CollectionTile(tile.valueOf())
            .changeName(string_1.generateUniqueName('i', collection.isNameAvailable))
            .changeTitle(tile.title + ' (copy)');
        return this.addTile(collection, newTile);
    };
    CollectionViewDelegate.prototype.createTile = function (collection, dataCube) {
        var _this = this;
        var timekeeper = this.getTimekeeper();
        var collectionURL = "#collection/" + collection.name;
        var onCancel = function () {
            _this.setState({ cubeViewSupervisor: undefined });
            window.location.hash = collectionURL;
        };
        var onSave = function (_collection, CollectionTile) {
            _this.setState({ cubeViewSupervisor: undefined });
            _this.addTile(_collection, CollectionTile).then(function (url) { return window.location.hash = url; });
        };
        var getConfirmationModal = function (newEssence) {
            return React.createElement(index_2.AddCollectionTileModal, {collection: collection, timekeeper: timekeeper, essence: newEssence, dataCube: dataCube, onSave: onSave});
        };
        this.setState({
            cubeViewSupervisor: {
                title: constants_1.STRINGS.addVisualization + ': ' + collection.title,
                cancel: onCancel,
                getConfirmationModal: getConfirmationModal,
                saveLabel: constants_1.STRINGS.add
            }
        }, function () { return window.location.hash = '#' + dataCube.name; });
    };
    CollectionViewDelegate.prototype.updateCollection = function (collection) {
        var appSettings = this.getSettings();
        return this.save(appSettings.addOrUpdateCollection(collection));
    };
    CollectionViewDelegate.prototype.deleteCollection = function (collection) {
        var _this = this;
        var appSettings = this.getSettings();
        var oldIndex = appSettings.collections.indexOf(collection);
        var undo = function () {
            _this.save(_this.getSettings().addCollectionAt(collection, oldIndex));
        };
        return this.save(appSettings.deleteCollection(collection)).then(function () {
            window.location.hash = "#/home";
            index_3.Notifier.success('Collection removed', { label: constants_1.STRINGS.undo, callback: undo });
        });
    };
    CollectionViewDelegate.prototype.updateTile = function (collection, tile) {
        var appSettings = this.getSettings();
        return this.save(appSettings.addOrUpdateCollection(collection.updateTile(tile)));
    };
    CollectionViewDelegate.prototype.editTile = function (collection, tile) {
        var _this = this;
        var appSettings = this.getSettings();
        var collectionURL = "#collection/" + collection.name + "/" + tile.name;
        var onCancel = function () { return window.location.hash = collectionURL; };
        var onSave = function (newEssence) {
            var newCollection = collection.updateTile(tile.changeEssence(newEssence));
            _this.save(appSettings.addOrUpdateCollection(newCollection))
                .then(function () { return window.location.hash = collectionURL; });
        };
        var essence = tile.essence;
        this.setState({
            cubeViewSupervisor: {
                title: constants_1.STRINGS.editVisualization + ': ' + collection.title + ' / ' + tile.title,
                cancel: onCancel,
                save: onSave
            }
        }, function () { return window.location.hash = "#" + essence.dataCube.name + "/" + essence.toHash(); });
    };
    return CollectionViewDelegate;
}());
exports.CollectionViewDelegate = CollectionViewDelegate;
