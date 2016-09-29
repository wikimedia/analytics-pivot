"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var immutable_class_1 = require('immutable-class');
var numeral = require('numeral');
var plywood_1 = require('plywood');
var general_1 = require('../../utils/general/general');
function formatFnFactory(format) {
    return function (n) {
        if (isNaN(n) || !isFinite(n))
            return '-';
        return numeral(n).format(format);
    };
}
var Measure = (function (_super) {
    __extends(Measure, _super);
    function Measure(parameters) {
        _super.call(this, parameters);
        this.title = this.title || general_1.makeTitle(this.name);
        this.expression = plywood_1.Expression.parse(this.formula);
        this.formatFn = formatFnFactory(this.getFormat());
    }
    Measure.isMeasure = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, Measure);
    };
    Measure.getMeasure = function (measures, measureName) {
        if (!measureName)
            return null;
        measureName = measureName.toLowerCase();
        return measures.find(function (measure) { return measure.name.toLowerCase() === measureName; });
    };
    Measure.getAggregateReferences = function (ex) {
        var references = [];
        ex.forEach(function (ex) {
            if (ex instanceof plywood_1.ChainExpression) {
                var actions = ex.actions;
                for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                    var action = actions_1[_i];
                    if (action.isAggregate()) {
                        references = references.concat(action.getFreeReferences());
                    }
                }
            }
        });
        return plywood_1.deduplicateSort(references);
    };
    Measure.getCountDistinctReferences = function (ex) {
        var references = [];
        ex.forEach(function (ex) {
            if (ex instanceof plywood_1.ChainExpression) {
                var actions = ex.actions;
                for (var _i = 0, actions_2 = actions; _i < actions_2.length; _i++) {
                    var action = actions_2[_i];
                    if (action.action === 'countDistinct') {
                        references = references.concat(action.getFreeReferences());
                    }
                }
            }
        });
        return plywood_1.deduplicateSort(references);
    };
    Measure.measuresFromAttributeInfo = function (attribute) {
        var name = attribute.name, special = attribute.special;
        var $main = plywood_1.$('main');
        var ref = plywood_1.$(name);
        if (special) {
            if (special === 'unique' || special === 'theta') {
                return [
                    new Measure({
                        name: general_1.makeUrlSafeName(name),
                        formula: $main.countDistinct(ref).toString()
                    })
                ];
            }
            else if (special === 'histogram') {
                return [
                    new Measure({
                        name: general_1.makeUrlSafeName(name + '_p98'),
                        formula: $main.quantile(ref, 0.98).toString()
                    })
                ];
            }
        }
        var expression = $main.sum(ref);
        var makerAction = attribute.makerAction;
        if (makerAction) {
            switch (makerAction.action) {
                case 'min':
                    expression = $main.min(ref);
                    break;
                case 'max':
                    expression = $main.max(ref);
                    break;
            }
        }
        return [new Measure({
                name: general_1.makeUrlSafeName(name),
                formula: expression.toString()
            })];
    };
    Measure.fromJS = function (parameters) {
        if (!parameters.formula) {
            var parameterExpression = parameters.expression;
            parameters.formula = (typeof parameterExpression === 'string' ? parameterExpression : plywood_1.$('main').sum(plywood_1.$(parameters.name)).toString());
        }
        return new Measure(immutable_class_1.BaseImmutable.jsToValue(Measure.PROPERTIES, parameters));
    };
    Measure.prototype.toApplyAction = function () {
        var _a = this, name = _a.name, expression = _a.expression;
        return new plywood_1.ApplyAction({
            name: name,
            expression: expression
        });
    };
    Measure.prototype.formatDatum = function (datum) {
        return this.formatFn(datum[this.name]);
    };
    Measure.prototype.getTitleWithUnits = function () {
        if (this.units) {
            return this.title + " (" + this.units + ")";
        }
        else {
            return this.title;
        }
    };
    Measure.DEFAULT_FORMAT = '0,0.0 a';
    Measure.INTEGER_FORMAT = '0,0 a';
    Measure.PROPERTIES = [
        { name: 'name', validate: general_1.verifyUrlSafeName },
        { name: 'title', defaultValue: null },
        { name: 'units', defaultValue: null },
        { name: 'formula' },
        { name: 'format', defaultValue: Measure.DEFAULT_FORMAT }
    ];
    return Measure;
}(immutable_class_1.BaseImmutable));
exports.Measure = Measure;
immutable_class_1.BaseImmutable.finalize(Measure);
