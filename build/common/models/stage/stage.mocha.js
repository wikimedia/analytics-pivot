"use strict";
var immutable_class_tester_1 = require('immutable-class-tester');
var stage_1 = require('./stage');
var stage_mock_1 = require('./stage.mock');
describe('Stage', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(stage_1.Stage, [
            stage_mock_1.StageMock.DEFAULT_A_JS,
            stage_mock_1.StageMock.DEFAULT_B_JS,
            stage_mock_1.StageMock.DEFAULT_C_JS
        ]);
    });
});
