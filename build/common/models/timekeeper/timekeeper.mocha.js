"use strict";
var chai_1 = require('chai');
var immutable_class_tester_1 = require('immutable-class-tester');
var timekeeper_1 = require('./timekeeper');
describe('Timekeeper', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(timekeeper_1.Timekeeper, [
            {
                timeTags: []
            },
            {
                timeTags: [
                    { name: 'lol', time: new Date('2016-01-01T01:02:03Z'), updated: new Date('2016-01-01T01:02:03Z') }
                ]
            },
            {
                timeTags: [
                    { name: 'lol', time: new Date('2016-01-01T01:02:03Z'), updated: new Date('2016-01-01T01:02:03Z') }
                ],
                nowOverride: new Date('2016-01-01T01:02:03Z')
            }
        ]);
    });
    it('works with now', function () {
        var timekeeper = timekeeper_1.Timekeeper.fromJS({
            timeTags: [],
            nowOverride: new Date('2016-01-01T01:02:03Z')
        });
        chai_1.expect(timekeeper.now()).to.deep.equal(new Date('2016-01-01T01:02:03Z'));
    });
});
