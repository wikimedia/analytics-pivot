"use strict";
var plywood_1 = require('plywood');
var circumstances_handler_1 = require('../../utils/circumstances-handler/circumstances-handler');
var manifest_1 = require('../../models/manifest/manifest');
var handler = circumstances_handler_1.CircumstancesHandler.EMPTY()
    .needsAtLeastOneSplit('The Table requires at least one split')
    .otherwise(function (splits, dataCube, colors, current) {
    var autoChanged = false;
    splits = splits.map(function (split, i) {
        var splitDimension = splits.get(0).getDimension(dataCube.dimensions);
        var sortStrategy = splitDimension.sortStrategy;
        if (!split.sortAction) {
            if (sortStrategy) {
                if (sortStrategy === 'self') {
                    split = split.changeSortAction(new plywood_1.SortAction({
                        expression: plywood_1.$(splitDimension.name),
                        direction: plywood_1.SortAction.DESCENDING
                    }));
                }
                else {
                    split = split.changeSortAction(new plywood_1.SortAction({
                        expression: plywood_1.$(sortStrategy),
                        direction: plywood_1.SortAction.DESCENDING
                    }));
                }
            }
            else {
                split = split.changeSortAction(dataCube.getDefaultSortAction());
                autoChanged = true;
            }
        }
        if (!split.limitAction && (autoChanged || splitDimension.kind !== 'time')) {
            split = split.changeLimit(i ? 5 : 50);
            autoChanged = true;
        }
        return split;
    });
    if (colors) {
        colors = null;
        autoChanged = true;
    }
    return autoChanged ? manifest_1.Resolve.automatic(6, { splits: splits }) : manifest_1.Resolve.ready(current ? 10 : 8);
});
exports.TABLE_MANIFEST = new manifest_1.Manifest('table', 'Table', handler.evaluate.bind(handler));
