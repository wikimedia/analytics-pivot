"use strict";
var Qajax = require('qajax');
function addErrorMonitor() {
    var originalOnError = window.onerror;
    window.onerror = function (message, file, line, column, errorObject) {
        column = column || (window.event && window.event.errorCharacter);
        var stack = errorObject ? errorObject.stack : null;
        var err = {
            message: message,
            file: file,
            line: line,
            column: column,
            stack: stack
        };
        if (typeof console !== "undefined") {
            console.log('An error has occurred. Please include the below information in the issue:');
            console.log(JSON.stringify(err));
        }
        Qajax({
            method: "POST",
            url: 'error',
            data: err
        });
        window.onerror = originalOnError;
        return false;
    };
}
exports.addErrorMonitor = addErrorMonitor;
