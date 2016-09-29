"use strict";
function getStack() {
    var ErrorConstructor = Error;
    var origPrepareStackTrace = ErrorConstructor.prepareStackTrace;
    ErrorConstructor.prepareStackTrace = function (_, stack) { return stack; };
    var err = new Error();
    var stack = err['stack'];
    ErrorConstructor.prepareStackTrace = origPrepareStackTrace;
    stack.shift();
    return stack;
}
function getCallerFile() {
    var stack = getStack();
    stack.shift();
    stack.shift();
    return stack[0].getFileName();
}
exports.getCallerFile = getCallerFile;
