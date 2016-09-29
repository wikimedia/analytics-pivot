"use strict";
var immutable_class_1 = require('immutable-class');
var plywood_1 = require('plywood');
var general_1 = require('../../utils/general/general');
var essence_1 = require('../essence/essence');
var check;
var CollectionTile = (function () {
    function CollectionTile(parameters) {
        var name = parameters.name;
        general_1.verifyUrlSafeName(name);
        this.name = name;
        this.title = parameters.title || general_1.makeTitle(name);
        this.description = parameters.description || '';
        this.group = parameters.group;
        this.dataCube = parameters.dataCube;
        this.essence = parameters.essence;
    }
    CollectionTile.isCollectionTile = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, CollectionTile);
    };
    CollectionTile.fromJS = function (parameters, context) {
        if (!context)
            throw new Error('CollectionTile must have context');
        var dataCubes = context.dataCubes, visualizations = context.visualizations;
        var dataCubeName = parameters.dataCube;
        var dataCube = plywood_1.find(dataCubes, function (d) { return d.name === dataCubeName; });
        if (!dataCube)
            throw new Error("can not find dataCube '" + dataCubeName + "'");
        var essence = essence_1.Essence.fromJS(parameters.essence, { dataCube: dataCube, visualizations: visualizations }).updateSplitsWithFilter();
        return new CollectionTile({
            name: parameters.name,
            title: parameters.title,
            description: parameters.description,
            group: parameters.group,
            dataCube: dataCube,
            essence: essence
        });
    };
    CollectionTile.prototype.valueOf = function () {
        return {
            name: this.name,
            title: this.title,
            description: this.description,
            group: this.group,
            dataCube: this.dataCube,
            essence: this.essence
        };
    };
    CollectionTile.prototype.toJS = function () {
        return {
            name: this.name,
            title: this.title,
            description: this.description,
            group: this.group,
            dataCube: this.dataCube.name,
            essence: this.essence.toJS()
        };
    };
    CollectionTile.prototype.toJSON = function () {
        return this.toJS();
    };
    CollectionTile.prototype.toString = function () {
        return "[LinkItem: " + this.name + "]";
    };
    CollectionTile.prototype.equals = function (other) {
        return CollectionTile.isCollectionTile(other) &&
            this.name === other.name &&
            this.title === other.title &&
            this.description === other.description &&
            this.group === other.group &&
            this.dataCube.equals(other.dataCube) &&
            this.essence.equals(other.essence);
    };
    CollectionTile.prototype.change = function (propertyName, newValue) {
        var v = this.valueOf();
        if (!v.hasOwnProperty(propertyName)) {
            throw new Error("Unknown property : " + propertyName);
        }
        v[propertyName] = newValue;
        return new CollectionTile(v);
    };
    CollectionTile.prototype.changeEssence = function (essence) {
        return this.change('essence', essence);
    };
    CollectionTile.prototype.changeName = function (name) {
        return this.change('name', name);
    };
    CollectionTile.prototype.changeTitle = function (title) {
        return this.change('title', title);
    };
    return CollectionTile;
}());
exports.CollectionTile = CollectionTile;
check = CollectionTile;
