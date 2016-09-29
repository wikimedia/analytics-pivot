"use strict";
var timekeeper_1 = require('./timekeeper');
var TimekeeperMock = (function () {
    function TimekeeperMock() {
    }
    TimekeeperMock.fixedJS = function () {
        return {
            timeTags: [],
            nowOverride: new Date('2016-08-08T08:08:08Z')
        };
    };
    TimekeeperMock.fixed = function () {
        return timekeeper_1.Timekeeper.fromJS(TimekeeperMock.fixedJS());
    };
    return TimekeeperMock;
}());
exports.TimekeeperMock = TimekeeperMock;
