"use strict";
function extend(source, target) {
    for (var key in source) {
        target[key] = source[key];
    }
    return target;
}
exports.extend = extend;
