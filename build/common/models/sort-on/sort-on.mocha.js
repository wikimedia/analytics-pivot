"use strict";
var immutable_class_tester_1 = require('immutable-class-tester');
var sort_on_1 = require('./sort-on');
describe('SortOn', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(sort_on_1.SortOn, [
            {
                measure: {
                    name: 'price',
                    title: 'Price',
                    formula: '$main.min($price)'
                }
            },
            {
                measure: {
                    name: 'price',
                    title: 'Price',
                    formula: '$main.sum($price)'
                }
            },
            {
                dimension: {
                    name: 'country',
                    title: 'Country',
                    formula: '$country',
                    kind: 'string'
                }
            }
        ]);
    });
});
