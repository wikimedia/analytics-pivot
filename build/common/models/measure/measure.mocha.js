"use strict";
var chai_1 = require('chai');
var immutable_class_tester_1 = require('immutable-class-tester');
var plywood_1 = require('plywood');
var measure_1 = require('./measure');
describe('Measure', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(measure_1.Measure, [
            {
                name: 'price',
                title: 'Price',
                formula: '$main.sum($price)'
            },
            {
                name: 'avg_price',
                title: 'Average Price',
                formula: '$main.average($price)'
            },
            {
                name: 'latency',
                title: 'Latency',
                units: 'ms',
                formula: '$main.sum($latency)'
            }
        ]);
    });
    describe('back compat', function () {
        it('upgrades expression to formula', function () {
            chai_1.expect(measure_1.Measure.fromJS({
                name: 'avg_price',
                title: 'Average Price',
                expression: '$main.average($price)'
            }).toJS()).to.deep.equal({
                name: 'avg_price',
                title: 'Average Price',
                formula: '$main.average($price)'
            });
        });
    });
    describe('.measuresFromAttributeInfo', function () {
        it('works with sum', function () {
            var attribute = plywood_1.AttributeInfo.fromJS({
                "name": "price",
                "type": "NUMBER",
                "unsplitable": true,
                "makerAction": {
                    "action": "sum",
                    "expression": {
                        "name": "price",
                        "op": "ref"
                    }
                }
            });
            var measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((function (m) { return m.toJS(); }));
            chai_1.expect(measures).to.deep.equal([
                {
                    "name": "price",
                    "title": "Price",
                    "formula": "$main.sum($price)"
                }
            ]);
        });
        it('works with min', function () {
            var attribute = plywood_1.AttributeInfo.fromJS({
                "name": "price",
                "type": "NUMBER",
                "unsplitable": true,
                "makerAction": {
                    "action": "min",
                    "expression": {
                        "name": "price",
                        "op": "ref"
                    }
                }
            });
            var measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((function (m) { return m.toJS(); }));
            chai_1.expect(measures).to.deep.equal([
                {
                    "name": "price",
                    "title": "Price",
                    "formula": "$main.min($price)"
                }
            ]);
        });
        it('works with max', function () {
            var attribute = plywood_1.AttributeInfo.fromJS({
                "name": "price",
                "type": "NUMBER",
                "unsplitable": true,
                "makerAction": {
                    "action": "max",
                    "expression": {
                        "name": "price",
                        "op": "ref"
                    }
                }
            });
            var measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((function (m) { return m.toJS(); }));
            chai_1.expect(measures).to.deep.equal([
                {
                    "name": "price",
                    "title": "Price",
                    "formula": "$main.max($price)"
                }
            ]);
        });
        it('works with histogram', function () {
            var attribute = plywood_1.AttributeInfo.fromJS({
                "name": "delta_hist",
                "special": "histogram",
                "type": "NUMBER"
            });
            var measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((function (m) { return m.toJS(); }));
            chai_1.expect(measures).to.deep.equal([
                {
                    "name": "delta_hist_p98",
                    "title": "Delta Hist P98",
                    "formula": "$main.quantile($delta_hist,0.98)"
                }
            ]);
        });
        it('works with unique', function () {
            var attribute = plywood_1.AttributeInfo.fromJS({
                "name": "unique_page",
                "special": "unique",
                "type": "STRING"
            });
            var measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((function (m) { return m.toJS(); }));
            chai_1.expect(measures).to.deep.equal([
                {
                    "name": "unique_page",
                    "title": "Unique Page",
                    "formula": "$main.countDistinct($unique_page)"
                }
            ]);
        });
        it('works with theta', function () {
            var attribute = plywood_1.AttributeInfo.fromJS({
                "name": "page_theta",
                "special": "theta",
                "type": "STRING"
            });
            var measures = measure_1.Measure.measuresFromAttributeInfo(attribute).map((function (m) { return m.toJS(); }));
            chai_1.expect(measures).to.deep.equal([
                {
                    "name": "page_theta",
                    "title": "Page Theta",
                    "formula": "$main.countDistinct($page_theta)"
                }
            ]);
        });
    });
});
