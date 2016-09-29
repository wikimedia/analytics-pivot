"use strict";
var immutable_class_1 = require('immutable-class');
var chronoshift_1 = require('chronoshift');
var plywood_1 = require('plywood');
function isLiteral(ex) {
    if (ex instanceof plywood_1.LiteralExpression)
        return plywood_1.TimeRange.isTimeRange(ex.value) || plywood_1.Set.isSet(ex.value) || plywood_1.NumberRange.isNumberRange(ex.value);
    return false;
}
function isRelative(ex) {
    if (ex instanceof plywood_1.ChainExpression) {
        if (ex.type !== 'TIME_RANGE')
            return false;
        var expression = ex.expression;
        if (expression instanceof plywood_1.RefExpression) {
            return expression.name === FilterClause.NOW_REF_NAME || expression.name === FilterClause.MAX_TIME_REF_NAME;
        }
    }
    return false;
}
function selectionsEqual(a, b) {
    if (!Boolean(a) === Boolean(b))
        return false;
    if (a === b)
        return true;
    if (!a !== !b)
        return false;
    if (typeof a !== typeof b)
        return false;
    if (typeof a === 'string' && typeof b === 'string')
        return a === b;
    return a.equals(b);
}
var check;
var FilterClause = (function () {
    function FilterClause(parameters) {
        var expression = parameters.expression, selection = parameters.selection, exclude = parameters.exclude, action = parameters.action;
        if (action)
            this.action = action;
        this.expression = expression;
        if (isRelative(selection)) {
            this.relative = true;
        }
        else if (isLiteral(selection)) {
            this.relative = false;
        }
        else if (action === 'match' && typeof selection !== 'string') {
            throw new Error("invalid match selection: " + selection);
        }
        else if (action === 'contains' && !(selection instanceof plywood_1.Expression)) {
            throw new Error("invalid contains expression: " + selection);
        }
        this.selection = selection;
        this.exclude = exclude || false;
    }
    FilterClause.isFilterClause = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, FilterClause);
    };
    FilterClause.evaluate = function (selection, now, maxTime, timezone) {
        if (!selection)
            return null;
        var maxTimeMinuteTop = chronoshift_1.minute.ceil(maxTime || now, timezone);
        var datum = {};
        datum[FilterClause.NOW_REF_NAME] = now;
        datum[FilterClause.MAX_TIME_REF_NAME] = maxTimeMinuteTop;
        return selection.defineEnvironment({ timezone: timezone }).getFn()(datum, {});
    };
    FilterClause.fromExpression = function (ex) {
        var exclude = false;
        if (ex.lastAction() instanceof plywood_1.NotAction) {
            ex = ex.popAction();
            exclude = true;
        }
        var lastAction = ex.lastAction();
        var dimExpression = ex.popAction();
        if (lastAction instanceof plywood_1.InAction || lastAction instanceof plywood_1.OverlapAction || lastAction instanceof plywood_1.ContainsAction) {
            var selection = lastAction.expression;
            var action = lastAction.action;
            return new FilterClause({
                action: action,
                expression: dimExpression,
                selection: selection,
                exclude: exclude
            });
        }
        if (lastAction instanceof plywood_1.MatchAction) {
            var regexp = lastAction.regexp;
            return new FilterClause({
                action: 'match',
                expression: dimExpression,
                selection: regexp,
                exclude: exclude
            });
        }
        throw new Error("invalid expression " + ex.toString());
    };
    FilterClause.fromJS = function (parameters) {
        var selection = parameters.selection, action = parameters.action;
        var value = {
            action: action,
            expression: plywood_1.Expression.fromJS(parameters.expression),
            selection: (typeof selection !== "string") ? plywood_1.Expression.fromJS(selection) : selection,
            exclude: Boolean(parameters.exclude)
        };
        return new FilterClause(value);
    };
    FilterClause.prototype.valueOf = function () {
        return {
            action: this.action,
            expression: this.expression,
            selection: this.selection,
            exclude: this.exclude
        };
    };
    FilterClause.prototype.toJS = function () {
        var _a = this, selection = _a.selection, action = _a.action;
        var js = {
            expression: this.expression.toJS(),
            selection: selection instanceof plywood_1.Expression ? selection.toJS() : selection
        };
        if (this.exclude)
            js.exclude = true;
        if (action)
            js.action = action;
        return js;
    };
    FilterClause.prototype.toJSON = function () {
        return this.toJS();
    };
    FilterClause.prototype.toString = function () {
        return "[FilterClause: " + this.expression.toString() + "]";
    };
    FilterClause.prototype.equals = function (other) {
        return FilterClause.isFilterClause(other) &&
            this.action === other.action &&
            this.expression.equals(other.expression) &&
            selectionsEqual(this.selection, other.selection) &&
            this.exclude === other.exclude;
    };
    FilterClause.prototype.toExpression = function () {
        var _a = this, expression = _a.expression, selection = _a.selection, action = _a.action;
        var ex = null;
        if (selection instanceof plywood_1.Expression) {
            var selectionType = selection.type;
            if (selectionType === 'TIME_RANGE' || selectionType === 'SET/TIME_RANGE' || selectionType === 'NUMBER_RANGE' || selectionType === 'SET/NUMBER_RANGE') {
                ex = expression.in(selection);
            }
            else if (action === 'contains') {
                ex = expression.contains(selection);
            }
            else {
                ex = expression.overlap(selection);
            }
        }
        else if (action === 'match') {
            ex = expression.match(selection);
        }
        if (this.exclude)
            ex = ex.not();
        return ex;
    };
    FilterClause.prototype.getLiteralSet = function () {
        var selection = this.selection;
        if (this.relative)
            return null;
        if (selection instanceof plywood_1.Expression) {
            var v = selection.getLiteralValue();
            return plywood_1.Set.isSet(v) ? v : plywood_1.Set.fromJS([v]);
        }
        else {
            return plywood_1.Set.fromJS([selection]);
        }
    };
    FilterClause.prototype.getExtent = function () {
        var mySet = this.getLiteralSet();
        return mySet ? mySet.extent() : null;
    };
    FilterClause.prototype.isLessThanFullDay = function () {
        var extent = this.getExtent();
        if (!extent)
            return false;
        return extent.end.valueOf() - extent.start.valueOf() < chronoshift_1.day.canonicalLength;
    };
    FilterClause.prototype.changeSelection = function (selection) {
        var value = this.valueOf();
        value.selection = selection;
        return new FilterClause(value);
    };
    FilterClause.prototype.changeExclude = function (exclude) {
        var value = this.valueOf();
        value.exclude = exclude;
        return new FilterClause(value);
    };
    FilterClause.prototype.evaluate = function (now, maxTime, timezone) {
        if (!this.relative)
            return this;
        return this.changeSelection(plywood_1.r(FilterClause.evaluate(this.selection, now, maxTime, timezone)));
    };
    FilterClause.NOW_REF_NAME = 'n';
    FilterClause.MAX_TIME_REF_NAME = 'm';
    return FilterClause;
}());
exports.FilterClause = FilterClause;
check = FilterClause;
