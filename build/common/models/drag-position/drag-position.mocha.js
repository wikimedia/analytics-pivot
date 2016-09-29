"use strict";
var immutable_class_tester_1 = require('immutable-class-tester');
var drag_position_1 = require('./drag-position');
describe('DragPosition', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(drag_position_1.DragPosition, [
            {
                insert: 0
            },
            {
                insert: 2
            },
            {
                replace: 0
            },
            {
                replace: 1
            }
        ]);
    });
});
