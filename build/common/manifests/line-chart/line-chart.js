"use strict";
var immutable_1 = require('immutable');
var plywood_1 = require('plywood');
var index_1 = require('../../models/index');
var circumstances_handler_1 = require('../../utils/circumstances-handler/circumstances-handler');
var manifest_1 = require('../../models/manifest/manifest');
var handler = circumstances_handler_1.CircumstancesHandler.EMPTY()
    .when(function (splits, dataCube) { return !(dataCube.getDimensionByKind('time') || dataCube.getDimensionByKind('number')); })
    .then(function () { return manifest_1.Resolve.NEVER; })
    .when(circumstances_handler_1.CircumstancesHandler.noSplits())
    .then(function (splits, dataCube) {
    var continuousDimensions = dataCube.getDimensionByKind('time').concat(dataCube.getDimensionByKind('number'));
    return manifest_1.Resolve.manual(3, 'This visualization requires a continuous dimension split', continuousDimensions.toArray().map(function (continuousDimension) {
        return {
            description: "Add a split on " + continuousDimension.title,
            adjustment: {
                splits: index_1.Splits.fromSplitCombine(index_1.SplitCombine.fromExpression(continuousDimension.expression))
            }
        };
    }));
})
    .when(circumstances_handler_1.CircumstancesHandler.areExactSplitKinds('time'))
    .or(circumstances_handler_1.CircumstancesHandler.areExactSplitKinds('number'))
    .then(function (splits, dataCube, colors, current) {
    var score = 4;
    var continuousSplit = splits.get(0);
    var continuousDimension = dataCube.getDimensionByExpression(continuousSplit.expression);
    var sortStrategy = continuousDimension.sortStrategy;
    var sortAction = null;
    if (sortStrategy && sortStrategy !== 'self') {
        sortAction = new plywood_1.SortAction({
            expression: plywood_1.$(sortStrategy),
            direction: plywood_1.SortAction.ASCENDING
        });
    }
    else {
        sortAction = new plywood_1.SortAction({
            expression: plywood_1.$(continuousDimension.name),
            direction: plywood_1.SortAction.ASCENDING
        });
    }
    var autoChanged = false;
    if (!sortAction.equals(continuousSplit.sortAction)) {
        continuousSplit = continuousSplit.changeSortAction(sortAction);
        autoChanged = true;
    }
    if (continuousSplit.limitAction && continuousDimension.kind === 'time') {
        continuousSplit = continuousSplit.changeLimitAction(null);
        autoChanged = true;
    }
    if (colors) {
        autoChanged = true;
    }
    if (continuousDimension.kind === 'time')
        score += 3;
    if (!autoChanged)
        return manifest_1.Resolve.ready(current ? 10 : score);
    return manifest_1.Resolve.automatic(score, { splits: new index_1.Splits(immutable_1.List([continuousSplit])) });
})
    .when(circumstances_handler_1.CircumstancesHandler.areExactSplitKinds('time', '*'))
    .then(function (splits, dataCube, colors) {
    var timeSplit = splits.get(0);
    var timeDimension = timeSplit.getDimension(dataCube.dimensions);
    var sortAction = new plywood_1.SortAction({
        expression: plywood_1.$(timeDimension.name),
        direction: plywood_1.SortAction.ASCENDING
    });
    if (!sortAction.equals(timeSplit.sortAction)) {
        timeSplit = timeSplit.changeSortAction(sortAction);
    }
    if (timeSplit.limitAction) {
        timeSplit = timeSplit.changeLimitAction(null);
    }
    var colorSplit = splits.get(1);
    if (!colorSplit.sortAction) {
        colorSplit = colorSplit.changeSortAction(dataCube.getDefaultSortAction());
    }
    var colorSplitDimension = dataCube.getDimensionByExpression(colorSplit.expression);
    if (!colors || colors.dimension !== colorSplitDimension.name) {
        colors = index_1.Colors.fromLimit(colorSplitDimension.name, 5);
    }
    return manifest_1.Resolve.automatic(8, {
        splits: new index_1.Splits(immutable_1.List([colorSplit, timeSplit])),
        colors: colors
    });
})
    .when(circumstances_handler_1.CircumstancesHandler.areExactSplitKinds('*', 'time'))
    .or(circumstances_handler_1.CircumstancesHandler.areExactSplitKinds('*', 'number'))
    .then(function (splits, dataCube, colors) {
    var timeSplit = splits.get(1);
    var timeDimension = timeSplit.getDimension(dataCube.dimensions);
    var autoChanged = false;
    var sortAction = new plywood_1.SortAction({
        expression: plywood_1.$(timeDimension.name),
        direction: plywood_1.SortAction.ASCENDING
    });
    if (!sortAction.equals(timeSplit.sortAction)) {
        timeSplit = timeSplit.changeSortAction(sortAction);
        autoChanged = true;
    }
    if (timeSplit.limitAction) {
        timeSplit = timeSplit.changeLimitAction(null);
        autoChanged = true;
    }
    var colorSplit = splits.get(0);
    if (!colorSplit.sortAction) {
        colorSplit = colorSplit.changeSortAction(dataCube.getDefaultSortAction());
        autoChanged = true;
    }
    var colorSplitDimension = dataCube.getDimensionByExpression(colorSplit.expression);
    if (!colors || colors.dimension !== colorSplitDimension.name) {
        colors = index_1.Colors.fromLimit(colorSplitDimension.name, 5);
        autoChanged = true;
    }
    if (!autoChanged)
        return manifest_1.Resolve.ready(10);
    return manifest_1.Resolve.automatic(8, {
        splits: new index_1.Splits(immutable_1.List([colorSplit, timeSplit])),
        colors: colors
    });
})
    .when(circumstances_handler_1.CircumstancesHandler.haveAtLeastSplitKinds('time'))
    .then(function (splits, dataCube) {
    var timeSplit = splits.toArray().filter(function (split) { return split.getDimension(dataCube.dimensions).kind === 'time'; })[0];
    return manifest_1.Resolve.manual(3, 'Too many splits on the line chart', [
        {
            description: "Remove all but the time split",
            adjustment: {
                splits: index_1.Splits.fromSplitCombine(timeSplit)
            }
        }
    ]);
})
    .otherwise(function (splits, dataCube) {
    var continuousDimensions = dataCube.getDimensionByKind('time').concat(dataCube.getDimensionByKind('number'));
    return manifest_1.Resolve.manual(3, 'The Line Chart needs one continuous dimension split', continuousDimensions.toArray().map(function (continuousDimension) {
        return {
            description: "Split on " + continuousDimension.title + " instead",
            adjustment: {
                splits: index_1.Splits.fromSplitCombine(index_1.SplitCombine.fromExpression(continuousDimension.expression))
            }
        };
    }));
});
exports.LINE_CHART_MANIFEST = new manifest_1.Manifest('line-chart', 'Line Chart', handler.evaluate.bind(handler));
