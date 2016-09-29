"use strict";
var DOMHighlighter = (function () {
    function DOMHighlighter() {
    }
    DOMHighlighter.select = function (selector) {
        var bits = selector.split(/\s+/);
        var element = document;
        var bit;
        while (bits.length && element) {
            bit = bits.shift().replace(/^\./, '').replace(/\./, ' ');
            element = element.getElementsByClassName(bit)[0];
        }
        if (!element || element === document) {
            console.warn("Selector '" + selector + "' returned no element in DOMHighlighter");
            return null;
        }
        return element;
    };
    DOMHighlighter.highlight = function (selector) {
        var element = this.select(selector);
        if (!element)
            return;
        element.classList.add('dom-highlighter-on');
    };
    DOMHighlighter.unhighlight = function (selector) {
        var element = this.select(selector);
        if (!element)
            return;
        element.classList.remove('dom-highlighter-on');
    };
    DOMHighlighter.wiggle = function (selector) {
        var element = this.select(selector);
        if (!element)
            return;
        element.classList.add('dom-highlighter-wiggle');
        window.setTimeout(function () {
            element.classList.remove('dom-highlighter-wiggle');
        }, 1000);
    };
    DOMHighlighter.timeoutsForElements = {};
    return DOMHighlighter;
}());
exports.DOMHighlighter = DOMHighlighter;
