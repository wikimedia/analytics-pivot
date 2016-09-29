"use strict";
var chai_1 = require('chai');
var React = require('react');
var ReactDOM = require('react-dom/server');
require('../../utils/test-utils/index');
var highlight_string_1 = require('./highlight-string');
describe('HighlightString', function () {
    it('properly highlights different types', function () {
        chai_1.expect(ReactDOM.renderToStaticMarkup(React.createElement(highlight_string_1.HighlightString, {highlight: /[0-9]*/, text: "2me2"}))).to.equal("<span class=\"highlight-string\"><span class=\"pre\"></span><span class=\"bold\">2</span><span class=\"post\">me2</span></span>");
        chai_1.expect(ReactDOM.renderToStaticMarkup(React.createElement(highlight_string_1.HighlightString, {highlight: "me", text: "2me2"}))).to.equal("<span class=\"highlight-string\"><span class=\"pre\">2</span><span class=\"bold\">me</span><span class=\"post\">2</span></span>");
    });
});
