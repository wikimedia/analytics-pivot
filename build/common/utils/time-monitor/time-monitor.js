"use strict";
var Q = require("q");
var timekeeper_1 = require("../../models/timekeeper/timekeeper");
var TimeMonitor = (function () {
    function TimeMonitor(logger) {
        this.doingChecks = false;
        this.logger = logger;
        this.checks = {};
        this.regularCheckInterval = 60000;
        this.specialCheckInterval = 60000;
        this.timekeeper = timekeeper_1.Timekeeper.EMPTY;
        setInterval(this.doChecks.bind(this), 1000);
    }
    TimeMonitor.prototype.addCheck = function (name, check) {
        this.checks[name] = check;
        this.timekeeper = this.timekeeper.addTimeTagFor(name);
        return this;
    };
    TimeMonitor.prototype.removeCheck = function (name) {
        delete this.checks[name];
        this.timekeeper = this.timekeeper.removeTimeTagFor(name);
        return this;
    };
    TimeMonitor.prototype.doCheck = function (name) {
        var _this = this;
        var logger = this.logger;
        var check = this.checks[name];
        if (!check)
            return Q(null);
        return check().then(function (updatedTime) {
            logger.log("Got the latest time for '" + name + "' (" + updatedTime.toISOString() + ")");
            _this.timekeeper = _this.timekeeper.updateTime(name, updatedTime);
        }, function (e) {
            logger.error("Error getting time for '" + name + "': " + e.message);
        });
    };
    TimeMonitor.prototype.doChecks = function () {
        var _this = this;
        var _a = this, doingChecks = _a.doingChecks, timekeeper = _a.timekeeper, regularCheckInterval = _a.regularCheckInterval;
        if (doingChecks)
            return;
        var now = timekeeper.now().valueOf();
        var timeTags = this.timekeeper.timeTags;
        this.doingChecks = true;
        var checkTasks = [];
        for (var _i = 0, timeTags_1 = timeTags; _i < timeTags_1.length; _i++) {
            var timeTag = timeTags_1[_i];
            if (!timeTag.time || now - timeTag.updated.valueOf() > regularCheckInterval) {
                checkTasks.push(this.doCheck(timeTag.name));
            }
        }
        Q.allSettled(checkTasks).then(function () {
            _this.doingChecks = false;
        });
    };
    return TimeMonitor;
}());
exports.TimeMonitor = TimeMonitor;
