"use strict";
var immutable_class_tester_1 = require('immutable-class-tester');
var splits_1 = require('./splits');
describe('Splits', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(splits_1.Splits, [
            [
                {
                    expression: { op: 'ref', name: 'language' }
                }
            ],
            [
                {
                    expression: { op: 'ref', name: 'time' }
                }
            ],
            [
                {
                    expression: { op: 'ref', name: 'time' },
                    bucketAction: {
                        action: 'in',
                        expression: {
                            'op': 'literal',
                            'value': { 'setType': 'STRING', 'elements': ['he'] },
                            'type': 'SET'
                        }
                    },
                    sortAction: {
                        action: 'sort',
                        direction: 'ascending',
                        expression: {
                            op: 'ref',
                            name: 'time'
                        }
                    },
                    limitAction: {
                        action: 'limit',
                        limit: 2
                    }
                },
                {
                    expression: { op: 'ref', name: 'time' }
                },
                {
                    expression: { op: 'ref', name: 'time' }
                }
            ]
        ]);
    });
});
