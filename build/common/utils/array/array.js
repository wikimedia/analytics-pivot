"use strict";
function move(array, oldIndex, newIndex) {
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
}
exports.move = move;
function indexByAttribute(array, key, value) {
    if (!array || !array.length)
        return -1;
    var n = array.length;
    for (var i = 0; i < n; i++) {
        if (array[i][key] === value)
            return i;
    }
    return -1;
}
exports.indexByAttribute = indexByAttribute;
