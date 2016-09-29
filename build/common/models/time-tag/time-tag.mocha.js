"use strict";
var immutable_class_tester_1 = require('immutable-class-tester');
var time_tag_1 = require('./time-tag');
describe('TimeTag', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(time_tag_1.TimeTag, [
            {
                name: 'dodo',
                time: new Date("2015-10-15T19:20:00Z"),
                updated: new Date("2015-10-15T19:20:13Z")
            },
            {
                name: 'wikipedia',
                time: new Date("2015-10-15T19:21:00Z"),
                updated: new Date("2015-10-15T19:21:13Z")
            }
        ]);
    });
});
