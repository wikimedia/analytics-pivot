"use strict";
function createFunctionSlot() {
    var _this = this;
    var myFn;
    var slot = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (myFn)
            return myFn.apply(_this, args);
        return undefined;
    };
    slot.fill = function (fn) { myFn = fn; };
    slot.clear = function () { myFn = null; };
    return slot;
}
exports.createFunctionSlot = createFunctionSlot;
