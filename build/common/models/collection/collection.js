"use strict";
var immutable_class_1 = require('immutable-class');
var plywood_1 = require('plywood');
var index_1 = require('../index');
var check;
var Collection = (function () {
    function Collection(parameters) {
        this.title = parameters.title;
        this.name = parameters.name;
        this.tiles = parameters.tiles;
        this.description = parameters.description;
        this.isNameAvailable = this.isNameAvailable.bind(this);
    }
    Collection.isCollection = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, Collection);
    };
    Collection.fromJS = function (parameters, context) {
        if (!context)
            throw new Error('Collection must have context');
        if (!parameters.name)
            throw new Error('Collection must have a name');
        var tiles = parameters.tiles || parameters.items || parameters.linkItems || [];
        return new Collection({
            title: parameters.title,
            name: parameters.name,
            description: parameters.description,
            tiles: tiles.map(function (linkItem) { return index_1.CollectionTile.fromJS(linkItem, context); })
        });
    };
    Collection.prototype.valueOf = function () {
        return {
            title: this.title,
            name: this.name,
            description: this.description,
            tiles: this.tiles
        };
    };
    Collection.prototype.toJS = function () {
        var o = {
            name: this.name,
            tiles: this.tiles.map(function (linkItem) { return linkItem.toJS(); })
        };
        if (this.description)
            o.description = this.description;
        if (this.title)
            o.title = this.title;
        return o;
    };
    Collection.prototype.toJSON = function () {
        return this.toJS();
    };
    Collection.prototype.toString = function () {
        return "[Collection: " + this.title + "]";
    };
    Collection.prototype.equals = function (other) {
        return Collection.isCollection(other) &&
            this.title === other.title &&
            this.name === other.name &&
            this.description === other.description &&
            immutable_class_1.immutableArraysEqual(this.tiles, other.tiles);
    };
    Collection.prototype.getDefaultTile = function () {
        return this.tiles[0];
    };
    Collection.prototype.findByName = function (name) {
        return plywood_1.findByName(this.tiles, name);
    };
    Collection.prototype.isNameAvailable = function (name) {
        return !this.findByName(name);
    };
    Collection.prototype.deleteTile = function (item) {
        var index = this.tiles.indexOf(item);
        if (index === -1)
            return this;
        var newTiles = this.tiles.concat();
        newTiles.splice(index, 1);
        return this.change('tiles', newTiles);
    };
    Collection.prototype.change = function (propertyName, newValue) {
        var v = this.valueOf();
        if (!v.hasOwnProperty(propertyName)) {
            throw new Error("Unknown property : " + propertyName);
        }
        v[propertyName] = newValue;
        return new Collection(v);
    };
    Collection.prototype.updateTile = function (tile) {
        var index = -1;
        this.tiles.forEach(function (_a, i) {
            var name = _a.name;
            if (name === tile.name) {
                index = i;
                return;
            }
        });
        if (index === -1) {
            throw new Error("Can't add unknown tile : " + tile.toString());
        }
        var newTiles = this.tiles.concat();
        newTiles[index] = tile;
        return this.change('tiles', newTiles);
    };
    Collection.prototype.changeTiles = function (tiles) {
        return this.change('tiles', tiles);
    };
    Collection.prototype.changeTitle = function (title) {
        return this.change('title', title);
    };
    return Collection;
}());
exports.Collection = Collection;
check = Collection;
