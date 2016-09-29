"use strict";
var chai_1 = require('chai');
var immutable_class_tester_1 = require('immutable-class-tester');
var dimension_1 = require('./dimension');
describe('Dimension', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(dimension_1.Dimension, [
            {
                name: 'country',
                title: 'important countries',
                formula: '$country',
                kind: 'string',
                granularities: [5, 50, 500, 800, 1000],
                sortStrategy: 'self'
            },
            {
                name: 'country',
                title: 'important countries',
                formula: '$country',
                kind: 'string',
                url: 'https://www.country.com/%s',
                bucketedBy: 1,
                bucketingStrategy: 'defaultBucket'
            },
            {
                name: 'time',
                title: 'time',
                formula: '$time',
                kind: 'time',
                url: 'http://www.time.com/%s',
                granularities: ['PT1M', { action: 'timeBucket', duration: 'P6M', timezone: 'Etc/UTC' }, 'PT6H', 'P1D', 'P1W']
            },
            {
                name: 'time',
                title: 'time',
                formula: '$time',
                kind: 'time',
                url: 'http://www.time.com/%s',
                granularities: ['PT1M', 'P6M', 'PT6H', 'P1D', 'P1W'],
                bucketedBy: 'PT6H'
            }
        ]);
    });
    describe('back compat', function () {
        it('upgrades expression to formula', function () {
            chai_1.expect(dimension_1.Dimension.fromJS({
                name: 'country',
                title: 'important countries',
                expression: '$country',
                kind: 'string'
            }).toJS()).to.deep.equal({
                name: 'country',
                title: 'important countries',
                formula: '$country',
                kind: 'string'
            });
        });
        it('neverBucket -> default no bucket', function () {
            chai_1.expect(dimension_1.Dimension.fromJS({
                name: 'country',
                title: 'important countries',
                expression: '$country',
                kind: 'string',
                bucketingStrategy: 'neverBucket'
            }).toJS()).to.deep.equal({
                name: 'country',
                title: 'important countries',
                formula: '$country',
                kind: 'string',
                bucketingStrategy: 'defaultNoBucket'
            });
        });
        it('alwaysBucket -> default bucket', function () {
            chai_1.expect(dimension_1.Dimension.fromJS({
                name: 'country',
                title: 'important countries',
                expression: '$country',
                kind: 'string',
                bucketingStrategy: 'alwaysBucket'
            }).toJS()).to.deep.equal({
                name: 'country',
                title: 'important countries',
                formula: '$country',
                kind: 'string',
                bucketingStrategy: 'defaultBucket'
            });
        });
    });
    describe('errors', function () {
        it('throws on invalid type', function () {
            var dimJS = {
                name: 'mixed_granularities',
                title: 'Mixed Granularities',
                kind: 'string',
                granularities: [5, 50, 'P1W', 800, 1000]
            };
            chai_1.expect(function () { dimension_1.Dimension.fromJS(dimJS); }).to.throw("granularities must have the same type of actions");
            var dimJS2 = {
                name: 'bad type',
                title: 'Bad Type',
                kind: 'string',
                granularities: [false, true, true, false, false]
            };
            chai_1.expect(function () { dimension_1.Dimension.fromJS(dimJS2); }).to.throw("input should be of type number, string, or action");
        });
    });
});
