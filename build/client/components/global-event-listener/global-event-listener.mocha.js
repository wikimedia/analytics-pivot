"use strict";
var React = require('react');
var TestUtils = require('react-addons-test-utils');
var global_event_listener_1 = require('./global-event-listener');
describe('GlobalEventListener', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(global_event_listener_1.GlobalEventListener, null));
    });
});
