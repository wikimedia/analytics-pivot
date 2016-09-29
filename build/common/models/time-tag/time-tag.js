"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var immutable_class_1 = require('immutable-class');
var TimeTag = (function (_super) {
    __extends(TimeTag, _super);
    function TimeTag(parameters) {
        _super.call(this, parameters);
        if (this.time && !this.updated)
            this.updated = this.time;
    }
    TimeTag.isTimeTag = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, TimeTag);
    };
    TimeTag.fromJS = function (parameters) {
        return new TimeTag(immutable_class_1.BaseImmutable.jsToValue(TimeTag.PROPERTIES, parameters));
    };
    TimeTag.prototype.changeTime = function (time, now) {
        var value = this.valueOf();
        value.time = time;
        value.updated = now;
        return new TimeTag(value);
    };
    TimeTag.PROPERTIES = [
        { name: 'name' },
        { name: 'time', isDate: true, defaultValue: null },
        { name: 'updated', isDate: true, defaultValue: null },
        { name: 'spacial', defaultValue: null }
    ];
    return TimeTag;
}(immutable_class_1.BaseImmutable));
exports.TimeTag = TimeTag;
immutable_class_1.BaseImmutable.finalize(TimeTag);
