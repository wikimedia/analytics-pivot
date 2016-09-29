"use strict";
var immutable_class_tester_1 = require('immutable-class-tester');
var external_view_1 = require('./external-view');
describe('ExternalView', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(external_view_1.ExternalView, [
            {
                title: "yahoo",
                linkGenerator: "'http://www.yahoo.com/filters/' + visualization.id"
            },
            {
                title: "google",
                linkGenerator: "'http://www.google.com/datasource/' + datasource.name",
                sameWindow: true
            }
        ]);
    });
});
