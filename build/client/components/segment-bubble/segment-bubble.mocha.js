"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
require('../../utils/test-utils/index');
var segment_bubble_1 = require('./segment-bubble');
describe.skip('SegmentBubble', function () {
    it('adds the correct class', function () {
        var renderedComponent = TestUtils.renderIntoDocument(React.createElement(segment_bubble_1.SegmentBubble, {left: null, top: null}));
        chai_1.expect(TestUtils.isCompositeComponent(renderedComponent), 'should be composite').to.equal(true);
        chai_1.expect(ReactDOM.findDOMNode(renderedComponent).className, 'should contain class').to.contain('segment-bubble');
    });
});
