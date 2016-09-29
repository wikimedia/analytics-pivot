"use strict";
function replaceHash(newHash) {
    window.history.replaceState(undefined, undefined, newHash);
}
exports.replaceHash = replaceHash;
