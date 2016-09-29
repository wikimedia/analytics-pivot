"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var immutable_class_1 = require('immutable-class');
var plywood_1 = require('plywood');
var time_tag_1 = require('../time-tag/time-tag');
var Timekeeper = (function (_super) {
    __extends(Timekeeper, _super);
    function Timekeeper(parameters) {
        _super.call(this, parameters);
    }
    Timekeeper.isTimekeeper = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, Timekeeper);
    };
    Timekeeper.globalNow = function () {
        return new Date();
    };
    Timekeeper.fromJS = function (parameters) {
        return new Timekeeper(immutable_class_1.BaseImmutable.jsToValue(Timekeeper.PROPERTIES, parameters));
    };
    Timekeeper.prototype.now = function () {
        return this.nowOverride || Timekeeper.globalNow();
    };
    Timekeeper.prototype.getTime = function (name) {
        var timeTag = plywood_1.findByName(this.timeTags, name);
        if (!timeTag || timeTag.special === 'realtime')
            return this.now();
        return timeTag.time || this.now();
    };
    Timekeeper.prototype.updateTime = function (name, time) {
        var value = this.valueOf();
        var tag = plywood_1.findByName(value.timeTags, name);
        if (!tag)
            return this;
        value.timeTags = plywood_1.overrideByName(value.timeTags, tag.changeTime(time, this.now()));
        return new Timekeeper(value);
    };
    Timekeeper.prototype.addTimeTagFor = function (name) {
        var value = this.valueOf();
        value.timeTags = value.timeTags.concat(new time_tag_1.TimeTag({ name: name }));
        return new Timekeeper(value);
    };
    Timekeeper.prototype.removeTimeTagFor = function (name) {
        var value = this.valueOf();
        value.timeTags = value.timeTags.filter(function (tag) { return tag.name !== name; });
        return new Timekeeper(value);
    };
    Timekeeper.PROPERTIES = [
        { name: 'timeTags', immutableClassArray: time_tag_1.TimeTag },
        { name: 'nowOverride', isDate: true, defaultValue: null }
    ];
    return Timekeeper;
}(immutable_class_1.BaseImmutable));
exports.Timekeeper = Timekeeper;
immutable_class_1.BaseImmutable.finalize(Timekeeper);
Timekeeper.EMPTY = new Timekeeper({ timeTags: [] });
