"use strict";
var numeral = require('numeral');
var plywood_1 = require('plywood');
var index_1 = require('../../models/index');
var time_1 = require('../../utils/time/time');
var scales = {
    'a': {
        '': 1,
        'k': 1e3,
        'm': 1e6,
        'b': 1e9,
        't': 1e12
    },
    'b': {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024,
        'PB': 1024 * 1024 * 1024 * 1024 * 1024,
        'EB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        'ZB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        'YB': 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024
    }
};
function getMiddleNumber(values) {
    var filteredAbsData = [];
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var v = values_1[_i];
        if (v === 0 || isNaN(v) || !isFinite(v))
            continue;
        filteredAbsData.push(Math.abs(v));
    }
    var n = filteredAbsData.length;
    if (n) {
        filteredAbsData.sort(function (a, b) { return b - a; });
        return filteredAbsData[Math.ceil((n - 1) / 2)];
    }
    else {
        return 0;
    }
}
exports.getMiddleNumber = getMiddleNumber;
function formatterFromData(values, format) {
    var match = format.match(/^(\S*)( ?)([ab])$/);
    if (match) {
        var numberFormat = match[1];
        var space = match[2];
        var formatType = match[3];
        var middle = getMiddleNumber(values);
        var formatMiddle = numeral(middle).format('0 ' + formatType);
        var unit = formatMiddle.split(' ')[1] || '';
        var scale = scales[formatType][unit];
        var append = unit ? space + unit : '';
        return function (n) {
            if (isNaN(n) || !isFinite(n))
                return '-';
            return numeral(n / scale).format(numberFormat) + append;
        };
    }
    else {
        return function (n) {
            if (isNaN(n) || !isFinite(n))
                return '-';
            return numeral(n).format(format);
        };
    }
}
exports.formatterFromData = formatterFromData;
function formatNumberRange(value) {
    return formatValue(value.start || "any") + " to " + formatValue(value.end || "any");
}
exports.formatNumberRange = formatNumberRange;
function formatValue(value, timezone, displayYear) {
    if (plywood_1.NumberRange.isNumberRange(value)) {
        return formatNumberRange(value);
    }
    else if (plywood_1.TimeRange.isTimeRange(value)) {
        return time_1.formatTimeRange(value, timezone, displayYear);
    }
    else {
        return '' + value;
    }
}
exports.formatValue = formatValue;
function formatFilterClause(dimension, clause, timezone, verbose) {
    var _a = this.getFormattedClause(dimension, clause, timezone, verbose), title = _a.title, values = _a.values;
    return title ? title + " " + values : values;
}
exports.formatFilterClause = formatFilterClause;
function getFormattedClause(dimension, clause, timezone, verbose) {
    var dimKind = dimension.kind;
    var values;
    var clauseSet = clause.getLiteralSet();
    function getClauseLabel() {
        var dimTitle = dimension.title;
        if (dimKind === 'time' && !verbose)
            return '';
        var delimiter = ["regex", "contains"].indexOf(clause.action) !== -1 ? ' ~' : ":";
        if (clauseSet && clauseSet.elements.length > 1 && !verbose)
            return "" + dimTitle;
        return "" + dimTitle + delimiter;
    }
    switch (dimKind) {
        case 'boolean':
        case 'number':
        case 'string':
            if (verbose) {
                values = clauseSet.toString();
            }
            else {
                var setElements = clauseSet.elements;
                if (setElements.length > 1) {
                    values = "(" + setElements.length + ")";
                }
                else {
                    values = formatValue(setElements[0]);
                }
            }
            if (clause.action === 'match')
                values = "/" + values + "/";
            if (clause.action === index_1.Filter.CONTAINS)
                values = "\"" + values + "\"";
            break;
        case 'time':
            var selection = clause.selection;
            var selectionType = selection.type;
            if (selectionType === 'TIME_RANGE') {
                var timeRange = selection.value;
                values = time_1.formatTimeRange(timeRange, timezone, time_1.DisplayYear.IF_DIFF);
            }
            else if (selectionType === "SET/TIME") {
                values = clauseSet.toString();
            }
            break;
        default:
            throw new Error("unknown kind " + dimKind);
    }
    return { title: getClauseLabel(), values: values };
}
exports.getFormattedClause = getFormattedClause;
