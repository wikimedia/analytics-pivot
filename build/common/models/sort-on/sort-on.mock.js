"use strict";
var sort_on_1 = require('./sort-on');
var SortOnMock = (function () {
    function SortOnMock() {
    }
    Object.defineProperty(SortOnMock, "DEFAULT_A_JS", {
        get: function () {
            return {
                measure: {
                    name: 'price',
                    title: 'Price',
                    formula: '$main.min($price)'
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortOnMock, "DEFAULT_B_JS", {
        get: function () {
            return {
                measure: {
                    name: 'price',
                    title: 'Price',
                    formula: '$main.sum($price)'
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortOnMock, "DEFAULT_C_JS", {
        get: function () {
            return {
                dimension: {
                    name: 'country',
                    title: 'important countries',
                    formula: '$country',
                    kind: 'string'
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    SortOnMock.defaultA = function () {
        return sort_on_1.SortOn.fromJS(SortOnMock.DEFAULT_A_JS);
    };
    SortOnMock.defaultB = function () {
        return sort_on_1.SortOn.fromJS(SortOnMock.DEFAULT_B_JS);
    };
    SortOnMock.defaultC = function () {
        return sort_on_1.SortOn.fromJS(SortOnMock.DEFAULT_C_JS);
    };
    return SortOnMock;
}());
exports.SortOnMock = SortOnMock;
