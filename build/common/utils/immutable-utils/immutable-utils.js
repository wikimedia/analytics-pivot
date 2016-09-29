"use strict";
var ImmutableUtils = (function () {
    function ImmutableUtils() {
    }
    ImmutableUtils.setProperty = function (instance, path, newValue) {
        var bits = path.split('.');
        var lastObject = newValue;
        var currentObject;
        var getLastObject = function () {
            var o = instance;
            for (var i = 0; i < bits.length; i++) {
                o = o[bits[i]];
            }
            return o;
        };
        while (bits.length) {
            var bit = bits.pop();
            currentObject = getLastObject();
            if (currentObject.change instanceof Function) {
                lastObject = currentObject.change(bit, lastObject);
            }
            else {
                var message = 'Can\'t find \`change()\` method on ' + currentObject.constructor.name;
                console.error(message);
                throw new Error(message);
            }
        }
        return lastObject;
    };
    ImmutableUtils.getProperty = function (instance, path) {
        var value = instance;
        var bits = path.split('.');
        var bit;
        while (bit = bits.shift())
            value = value[bit];
        return value;
    };
    ImmutableUtils.change = function (instance, propertyName, newValue) {
        var v = instance.valueOf();
        if (!v.hasOwnProperty(propertyName)) {
            throw new Error("Unknown property : " + propertyName);
        }
        v[propertyName] = newValue;
        return new instance.constructor(v);
    };
    ImmutableUtils.addInArray = function (instance, propertyName, newItem, index) {
        if (index === void 0) { index = -1; }
        var newArray = instance[propertyName];
        if (index === -1) {
            newArray.push(newItem);
        }
        else {
            newArray[index] = newItem;
        }
        return ImmutableUtils.change(instance, propertyName, newArray);
    };
    return ImmutableUtils;
}());
exports.ImmutableUtils = ImmutableUtils;
