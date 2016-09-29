"use strict";
var immutable_1 = require('immutable');
var lz_string_1 = require('lz-string');
var immutable_class_1 = require('immutable-class');
var chronoshift_1 = require('chronoshift');
var plywood_1 = require('plywood');
var general_1 = require('../../../common/utils/general/general');
var filter_1 = require('../filter/filter');
var filter_clause_1 = require('../filter-clause/filter-clause');
var highlight_1 = require('../highlight/highlight');
var splits_1 = require('../splits/splits');
var colors_1 = require('../colors/colors');
var manifest_1 = require('../manifest/manifest');
var HASH_VERSION = 2;
function constrainDimensions(dimensions, dataCube) {
    return dimensions.filter(function (dimensionName) { return Boolean(dataCube.getDimension(dimensionName)); });
}
function constrainMeasures(measures, dataCube) {
    return measures.filter(function (measureName) { return Boolean(dataCube.getMeasure(measureName)); });
}
function addToSetInOrder(order, setToAdd, thing) {
    return immutable_1.OrderedSet(order.toArray().filter(function (name) { return setToAdd.has(name) || name === thing; }));
}
(function (VisStrategy) {
    VisStrategy[VisStrategy["FairGame"] = 0] = "FairGame";
    VisStrategy[VisStrategy["UnfairGame"] = 1] = "UnfairGame";
    VisStrategy[VisStrategy["KeepAlways"] = 2] = "KeepAlways";
})(exports.VisStrategy || (exports.VisStrategy = {}));
var VisStrategy = exports.VisStrategy;
var check;
var Essence = (function () {
    function Essence(parameters) {
        var visualizations = parameters.visualizations, dataCube = parameters.dataCube, visualization = parameters.visualization, timezone = parameters.timezone, filter = parameters.filter, splits = parameters.splits, multiMeasureMode = parameters.multiMeasureMode, singleMeasure = parameters.singleMeasure, selectedMeasures = parameters.selectedMeasures, pinnedDimensions = parameters.pinnedDimensions, colors = parameters.colors, pinnedSort = parameters.pinnedSort, compare = parameters.compare, highlight = parameters.highlight;
        if (!dataCube)
            throw new Error('Essence must have a dataCube');
        timezone = timezone || chronoshift_1.Timezone.UTC;
        if (!filter) {
            filter = dataCube.getDefaultFilter();
        }
        multiMeasureMode = Boolean(multiMeasureMode);
        function visibleMeasure(measureName) {
            return multiMeasureMode ? selectedMeasures.has(measureName) : measureName === singleMeasure;
        }
        if (highlight && highlight.measure && !visibleMeasure(highlight.measure)) {
            highlight = null;
        }
        if (visualizations) {
            if (!visualization) {
                var visAndResolve = Essence.getBestVisualization(visualizations, dataCube, splits, colors, null);
                visualization = visAndResolve.visualization;
            }
            var visResolve = visualization.handleCircumstance(dataCube, splits, colors, true);
            if (visResolve.isAutomatic()) {
                var adjustment = visResolve.adjustment;
                splits = adjustment.splits;
                colors = adjustment.colors || null;
                visResolve = visualization.handleCircumstance(dataCube, splits, colors, true);
                if (!visResolve.isReady()) {
                    console.log(visResolve);
                    throw new Error(visualization.title + ' must be ready after automatic adjustment');
                }
            }
        }
        this.visualizations = visualizations;
        this.dataCube = dataCube;
        this.visualization = visualization;
        this.dataCube = dataCube;
        this.timezone = timezone;
        this.filter = filter;
        this.splits = splits;
        this.multiMeasureMode = multiMeasureMode;
        this.singleMeasure = singleMeasure;
        this.selectedMeasures = selectedMeasures;
        this.pinnedDimensions = pinnedDimensions;
        this.colors = colors;
        this.pinnedSort = pinnedSort;
        this.highlight = highlight;
        this.compare = compare;
        this.visResolve = visResolve;
    }
    Essence.isEssence = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, Essence);
    };
    Essence.getBestVisualization = function (visualizations, dataCube, splits, colors, currentVisualization) {
        var visAndResolves = visualizations.map(function (visualization) {
            return {
                visualization: visualization,
                resolve: visualization.handleCircumstance(dataCube, splits, colors, visualization === currentVisualization)
            };
        });
        return visAndResolves.sort(function (vr1, vr2) { return manifest_1.Resolve.compare(vr1.resolve, vr2.resolve); })[0];
    };
    Essence.fromHash = function (hash, context) {
        var parts = hash.split('/');
        if (parts.length < 3)
            return null;
        var visualization = parts.shift();
        var version = parseInt(parts.shift(), 10);
        if (version > HASH_VERSION)
            return null;
        var jsArray = null;
        try {
            jsArray = JSON.parse('[' + lz_string_1.decompressFromBase64(parts.join('/')) + ']');
        }
        catch (e) {
            return null;
        }
        if (!Array.isArray(jsArray))
            return null;
        if (version === 1) {
            jsArray.splice(3, 0, false, null);
        }
        var jsArrayLength = jsArray.length;
        if (!(8 <= jsArrayLength && jsArrayLength <= 11))
            return null;
        var essence;
        try {
            essence = Essence.fromJS({
                visualization: visualization,
                timezone: jsArray[0],
                filter: jsArray[1],
                splits: jsArray[2],
                multiMeasureMode: jsArray[3],
                singleMeasure: jsArray[4],
                selectedMeasures: jsArray[5],
                pinnedDimensions: jsArray[6],
                pinnedSort: jsArray[7],
                colors: jsArray[8] || null,
                compare: jsArray[9] || null,
                highlight: jsArray[10] || null
            }, context);
        }
        catch (e) {
            return null;
        }
        return essence;
    };
    Essence.fromDataCube = function (dataCube, context) {
        var essence = new Essence({
            dataCube: context.dataCube,
            visualizations: context.visualizations,
            visualization: null,
            timezone: dataCube.getDefaultTimezone(),
            filter: null,
            splits: dataCube.getDefaultSplits(),
            multiMeasureMode: false,
            singleMeasure: dataCube.getDefaultSortMeasure(),
            selectedMeasures: dataCube.getDefaultSelectedMeasures(),
            pinnedDimensions: dataCube.getDefaultPinnedDimensions(),
            colors: null,
            pinnedSort: dataCube.getDefaultSortMeasure(),
            compare: null,
            highlight: null
        });
        return essence.updateSplitsWithFilter();
    };
    Essence.fromJS = function (parameters, context) {
        if (!context)
            throw new Error('Essence must have context');
        var dataCube = context.dataCube, visualizations = context.visualizations;
        var visualizationName = parameters.visualization;
        if (visualizationName === 'time-series')
            visualizationName = 'line-chart';
        var visualization = plywood_1.findByName(visualizations, visualizationName);
        var timezone = parameters.timezone ? chronoshift_1.Timezone.fromJS(parameters.timezone) : null;
        var filter = parameters.filter ? filter_1.Filter.fromJS(parameters.filter).constrainToDimensions(dataCube.dimensions, dataCube.timeAttribute) : null;
        var splits = splits_1.Splits.fromJS(parameters.splits || [], dataCube).constrainToDimensionsAndMeasures(dataCube.dimensions, dataCube.measures);
        var defaultSortMeasureName = dataCube.getDefaultSortMeasure();
        var multiMeasureMode = general_1.hasOwnProperty(parameters, 'multiMeasureMode') ? parameters.multiMeasureMode : !general_1.hasOwnProperty(parameters, 'singleMeasure');
        var singleMeasure = dataCube.getMeasure(parameters.singleMeasure) ? parameters.singleMeasure : defaultSortMeasureName;
        var selectedMeasures = constrainMeasures(immutable_1.OrderedSet(parameters.selectedMeasures || []), dataCube);
        var pinnedDimensions = constrainDimensions(immutable_1.OrderedSet(parameters.pinnedDimensions || []), dataCube);
        var colors = parameters.colors ? colors_1.Colors.fromJS(parameters.colors) : null;
        var pinnedSort = dataCube.getMeasure(parameters.pinnedSort) ? parameters.pinnedSort : defaultSortMeasureName;
        var compare = null;
        var compareJS = parameters.compare;
        if (compareJS) {
            compare = filter_1.Filter.fromJS(compareJS).constrainToDimensions(dataCube.dimensions, dataCube.timeAttribute);
        }
        var highlight = null;
        var highlightJS = parameters.highlight;
        if (highlightJS) {
            highlight = highlight_1.Highlight.fromJS(highlightJS).constrainToDimensions(dataCube.dimensions, dataCube.timeAttribute);
        }
        return new Essence({
            dataCube: dataCube,
            visualizations: visualizations,
            visualization: visualization,
            timezone: timezone,
            filter: filter,
            splits: splits,
            multiMeasureMode: multiMeasureMode,
            singleMeasure: singleMeasure,
            selectedMeasures: selectedMeasures,
            pinnedDimensions: pinnedDimensions,
            colors: colors,
            pinnedSort: pinnedSort,
            compare: compare,
            highlight: highlight
        });
    };
    Essence.prototype.valueOf = function () {
        return {
            dataCube: this.dataCube,
            visualizations: this.visualizations,
            visualization: this.visualization,
            timezone: this.timezone,
            filter: this.filter,
            splits: this.splits,
            multiMeasureMode: this.multiMeasureMode,
            singleMeasure: this.singleMeasure,
            selectedMeasures: this.selectedMeasures,
            pinnedDimensions: this.pinnedDimensions,
            colors: this.colors,
            pinnedSort: this.pinnedSort,
            compare: this.compare,
            highlight: this.highlight
        };
    };
    Essence.prototype.toJS = function () {
        var js = {
            visualization: this.visualization.name,
            timezone: this.timezone.toJS(),
            filter: this.filter.toJS(),
            splits: this.splits.toJS(),
            singleMeasure: this.singleMeasure,
            selectedMeasures: this.selectedMeasures.toArray(),
            pinnedDimensions: this.pinnedDimensions.toArray()
        };
        if (this.multiMeasureMode)
            js.multiMeasureMode = true;
        if (this.colors)
            js.colors = this.colors.toJS();
        var defaultSortMeasure = this.dataCube.getDefaultSortMeasure();
        if (this.pinnedSort !== defaultSortMeasure)
            js.pinnedSort = this.pinnedSort;
        if (this.compare)
            js.compare = this.compare.toJS();
        if (this.highlight)
            js.highlight = this.highlight.toJS();
        return js;
    };
    Essence.prototype.toJSON = function () {
        return this.toJS();
    };
    Essence.prototype.toString = function () {
        return "[Essence]";
    };
    Essence.prototype.equals = function (other) {
        return Essence.isEssence(other) &&
            this.dataCube.equals(other.dataCube) &&
            this.visualization.name === other.visualization.name &&
            this.timezone.equals(other.timezone) &&
            this.filter.equals(other.filter) &&
            this.splits.equals(other.splits) &&
            this.multiMeasureMode === other.multiMeasureMode &&
            this.singleMeasure === other.singleMeasure &&
            this.selectedMeasures.equals(other.selectedMeasures) &&
            this.pinnedDimensions.equals(other.pinnedDimensions) &&
            immutable_class_1.immutableEqual(this.colors, other.colors) &&
            this.pinnedSort === other.pinnedSort &&
            immutable_class_1.immutableEqual(this.compare, other.compare) &&
            immutable_class_1.immutableEqual(this.highlight, other.highlight);
    };
    Essence.prototype.toHash = function () {
        var js = this.toJS();
        var compressed = [
            js.timezone,
            js.filter,
            js.splits,
            js.multiMeasureMode,
            js.singleMeasure,
            js.selectedMeasures,
            js.pinnedDimensions,
            js.pinnedSort
        ];
        if (js.colors)
            compressed[8] = js.colors;
        if (js.compare)
            compressed[9] = js.compare;
        if (js.highlight)
            compressed[10] = js.highlight;
        var restJSON = [];
        for (var i = 0; i < compressed.length; i++) {
            restJSON.push(JSON.stringify(compressed[i] || null));
        }
        return [
            js.visualization,
            HASH_VERSION,
            lz_string_1.compressToBase64(restJSON.join(','))
        ].join('/');
    };
    Essence.prototype.getURL = function (urlPrefix) {
        return urlPrefix + this.toHash();
    };
    Essence.prototype.getTimeAttribute = function () {
        return this.dataCube.timeAttribute;
    };
    Essence.prototype.getTimeDimension = function () {
        return this.dataCube.getTimeDimension();
    };
    Essence.prototype.evaluateSelection = function (selection, timekeeper) {
        var _a = this, timezone = _a.timezone, dataCube = _a.dataCube;
        return filter_clause_1.FilterClause.evaluate(selection, timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone);
    };
    Essence.prototype.evaluateClause = function (clause, timekeeper) {
        var _a = this, timezone = _a.timezone, dataCube = _a.dataCube;
        return clause.evaluate(timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone);
    };
    Essence.prototype.getEffectiveFilter = function (timekeeper, highlightId, unfilterDimension) {
        if (highlightId === void 0) { highlightId = null; }
        if (unfilterDimension === void 0) { unfilterDimension = null; }
        var _a = this, dataCube = _a.dataCube, filter = _a.filter, highlight = _a.highlight, timezone = _a.timezone;
        if (highlight && (highlightId !== highlight.owner))
            filter = highlight.applyToFilter(filter);
        if (unfilterDimension)
            filter = filter.remove(unfilterDimension.expression);
        return filter.getSpecificFilter(timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone);
    };
    Essence.prototype.getTimeSelection = function () {
        var timeAttribute = this.getTimeAttribute();
        return this.filter.getSelection(timeAttribute);
    };
    Essence.prototype.isFixedMeasureMode = function () {
        return this.visualization.measureModeNeed !== 'any';
    };
    Essence.prototype.getEffectiveMultiMeasureMode = function () {
        var measureModeNeed = this.visualization.measureModeNeed;
        if (measureModeNeed !== 'any') {
            return measureModeNeed === 'multi';
        }
        return this.multiMeasureMode;
    };
    Essence.prototype.getEffectiveMeasures = function () {
        if (this.getEffectiveMultiMeasureMode()) {
            return this.getMeasures();
        }
        else {
            return immutable_1.List([this.dataCube.getMeasure(this.singleMeasure)]);
        }
    };
    Essence.prototype.getMeasures = function () {
        var dataCube = this.dataCube;
        return this.selectedMeasures.toList().map(function (measureName) { return dataCube.getMeasure(measureName); });
    };
    Essence.prototype.getEffectiveSelectedMeasure = function () {
        if (this.getEffectiveMultiMeasureMode()) {
            return this.selectedMeasures;
        }
        else {
            return immutable_1.OrderedSet([this.singleMeasure]);
        }
    };
    Essence.prototype.differentDataCube = function (other) {
        return this.dataCube !== other.dataCube;
    };
    Essence.prototype.differentTimezone = function (other) {
        return !this.timezone.equals(other.timezone);
    };
    Essence.prototype.differentTimezoneMatters = function (other) {
        return this.splits.timezoneDependant() && this.differentTimezone(other);
    };
    Essence.prototype.differentFilter = function (other) {
        return !this.filter.equals(other.filter);
    };
    Essence.prototype.differentSplits = function (other) {
        return !this.splits.equals(other.splits);
    };
    Essence.prototype.differentEffectiveSplits = function (other) {
        return this.differentSplits(other) || this.differentTimezoneMatters(other);
    };
    Essence.prototype.differentColors = function (other) {
        if (Boolean(this.colors) !== Boolean(other.colors))
            return true;
        if (!this.colors)
            return false;
        return !this.colors.equals(other.colors);
    };
    Essence.prototype.differentSelectedMeasures = function (other) {
        return !this.selectedMeasures.equals(other.selectedMeasures);
    };
    Essence.prototype.differentEffectiveMeasures = function (other) {
        return !this.getEffectiveSelectedMeasure().equals(other.getEffectiveSelectedMeasure());
    };
    Essence.prototype.newSelectedMeasures = function (other) {
        return !this.selectedMeasures.isSubset(other.selectedMeasures);
    };
    Essence.prototype.newEffectiveMeasures = function (other) {
        return !this.getEffectiveSelectedMeasure().isSubset(other.getEffectiveSelectedMeasure());
    };
    Essence.prototype.differentPinnedDimensions = function (other) {
        return !this.pinnedDimensions.equals(other.pinnedDimensions);
    };
    Essence.prototype.differentPinnedSort = function (other) {
        return this.pinnedSort !== other.pinnedSort;
    };
    Essence.prototype.differentCompare = function (other) {
        if (Boolean(this.compare) !== Boolean(other.compare))
            return true;
        return Boolean(this.compare && !this.compare.equals(other.compare));
    };
    Essence.prototype.differentHighligh = function (other) {
        if (Boolean(this.highlight) !== Boolean(other.highlight))
            return true;
        return Boolean(this.highlight && !this.highlight.equals(other.highlight));
    };
    Essence.prototype.differentEffectiveFilter = function (other, myTimekeeper, otherTimekeeper, highlightId, unfilterDimension) {
        if (highlightId === void 0) { highlightId = null; }
        if (unfilterDimension === void 0) { unfilterDimension = null; }
        var myEffectiveFilter = this.getEffectiveFilter(myTimekeeper, highlightId, unfilterDimension);
        var otherEffectiveFilter = other.getEffectiveFilter(otherTimekeeper, highlightId, unfilterDimension);
        return !myEffectiveFilter.equals(otherEffectiveFilter);
    };
    Essence.prototype.highlightOn = function (owner, measure) {
        var highlight = this.highlight;
        if (!highlight)
            return false;
        return highlight.owner === owner && (!measure || highlight.measure === measure);
    };
    Essence.prototype.highlightOnDifferentMeasure = function (owner, measure) {
        var highlight = this.highlight;
        if (!highlight)
            return false;
        return highlight.owner === owner && measure && highlight.measure !== measure;
    };
    Essence.prototype.getSingleHighlightSet = function () {
        var highlight = this.highlight;
        if (!highlight)
            return null;
        return highlight.delta.getSingleClauseSet();
    };
    Essence.prototype.getApplyForSort = function (sort) {
        var sortOn = sort.expression.name;
        var sortMeasure = this.dataCube.getMeasure(sortOn);
        if (!sortMeasure)
            return null;
        return sortMeasure.toApplyAction();
    };
    Essence.prototype.getCommonSort = function () {
        return this.splits.getCommonSort(this.dataCube.dimensions);
    };
    Essence.prototype.updateDataCube = function (newDataCube) {
        var _a = this, dataCube = _a.dataCube, visualizations = _a.visualizations;
        if (dataCube.equals(newDataCube))
            return this;
        var value = this.valueOf();
        value.dataCube = newDataCube;
        value.filter = value.filter.constrainToDimensions(newDataCube.dimensions, newDataCube.timeAttribute, dataCube.timeAttribute);
        value.splits = value.splits.constrainToDimensionsAndMeasures(newDataCube.dimensions, newDataCube.measures);
        value.selectedMeasures = constrainMeasures(value.selectedMeasures, newDataCube);
        if (value.selectedMeasures.size === 0) {
            value.selectedMeasures = newDataCube.getDefaultSelectedMeasures();
        }
        value.pinnedDimensions = constrainDimensions(value.pinnedDimensions, newDataCube);
        if (value.colors && !newDataCube.getDimension(value.colors.dimension)) {
            value.colors = null;
        }
        if (!newDataCube.getMeasure(value.pinnedSort))
            value.pinnedSort = newDataCube.getDefaultSortMeasure();
        if (value.compare) {
            value.compare = value.compare.constrainToDimensions(newDataCube.dimensions, newDataCube.timeAttribute);
        }
        if (value.highlight) {
            value.highlight = value.highlight.constrainToDimensions(newDataCube.dimensions, newDataCube.timeAttribute);
        }
        return new Essence(value);
    };
    Essence.prototype.changeFilter = function (filter, removeHighlight) {
        if (removeHighlight === void 0) { removeHighlight = false; }
        var value = this.valueOf();
        value.filter = filter;
        if (removeHighlight) {
            value.highlight = null;
        }
        var differentAttributes = filter.getDifferentAttributes(this.filter);
        value.splits = value.splits.removeBucketingFrom(differentAttributes);
        return (new Essence(value)).updateSplitsWithFilter();
    };
    Essence.prototype.changeTimezone = function (newTimezone) {
        var timezone = this.timezone;
        if (timezone === newTimezone)
            return this;
        var value = this.valueOf();
        value.timezone = newTimezone;
        return new Essence(value);
    };
    Essence.prototype.changeTimeSelection = function (check) {
        var filter = this.filter;
        var timeAttribute = this.getTimeAttribute();
        return this.changeFilter(filter.setSelection(timeAttribute, check));
    };
    Essence.prototype.convertToSpecificFilter = function (timekeeper) {
        var _a = this, dataCube = _a.dataCube, filter = _a.filter, timezone = _a.timezone;
        if (!filter.isRelative())
            return this;
        return this.changeFilter(filter.getSpecificFilter(timekeeper.now(), dataCube.getMaxTime(timekeeper), timezone));
    };
    Essence.prototype.changeSplits = function (splits, strategy) {
        var _a = this, visualizations = _a.visualizations, dataCube = _a.dataCube, visualization = _a.visualization, visResolve = _a.visResolve, filter = _a.filter, colors = _a.colors;
        splits = splits.updateWithFilter(filter, dataCube.dimensions);
        if (visResolve.isManual()) {
            strategy = VisStrategy.KeepAlways;
        }
        if (this.splits.length() > 0 && splits.length() !== 0)
            strategy = VisStrategy.UnfairGame;
        if (strategy !== VisStrategy.KeepAlways && strategy !== VisStrategy.UnfairGame) {
            var visAndResolve = Essence.getBestVisualization(visualizations, dataCube, splits, colors, (strategy === VisStrategy.FairGame ? null : visualization));
            visualization = visAndResolve.visualization;
        }
        var value = this.valueOf();
        value.splits = splits;
        value.visualization = visualization;
        if (value.highlight) {
            value.filter = value.highlight.applyToFilter(value.filter);
            value.highlight = null;
        }
        return new Essence(value);
    };
    Essence.prototype.changeSplit = function (splitCombine, strategy) {
        return this.changeSplits(splits_1.Splits.fromSplitCombine(splitCombine), strategy);
    };
    Essence.prototype.addSplit = function (split, strategy) {
        var splits = this.splits;
        return this.changeSplits(splits.addSplit(split), strategy);
    };
    Essence.prototype.removeSplit = function (split, strategy) {
        var splits = this.splits;
        return this.changeSplits(splits.removeSplit(split), strategy);
    };
    Essence.prototype.updateSplitsWithFilter = function () {
        var value = this.valueOf();
        var newSplits = value.splits.updateWithFilter(this.filter, this.dataCube.dimensions);
        if (value.splits === newSplits)
            return this;
        value.splits = newSplits;
        return new Essence(value);
    };
    Essence.prototype.changeColors = function (colors) {
        var value = this.valueOf();
        value.colors = colors;
        return new Essence(value);
    };
    Essence.prototype.changeVisualization = function (visualization) {
        var value = this.valueOf();
        value.visualization = visualization;
        return new Essence(value);
    };
    Essence.prototype.pin = function (dimension) {
        var value = this.valueOf();
        value.pinnedDimensions = value.pinnedDimensions.add(dimension.name);
        return new Essence(value);
    };
    Essence.prototype.unpin = function (dimension) {
        var value = this.valueOf();
        value.pinnedDimensions = value.pinnedDimensions.remove(dimension.name);
        return new Essence(value);
    };
    Essence.prototype.getPinnedSortMeasure = function () {
        return this.dataCube.getMeasure(this.pinnedSort);
    };
    Essence.prototype.changePinnedSortMeasure = function (measure) {
        var value = this.valueOf();
        value.pinnedSort = measure.name;
        return new Essence(value);
    };
    Essence.prototype.toggleMultiMeasureMode = function () {
        var _a = this, dataCube = _a.dataCube, multiMeasureMode = _a.multiMeasureMode, selectedMeasures = _a.selectedMeasures, singleMeasure = _a.singleMeasure;
        var value = this.valueOf();
        value.multiMeasureMode = !multiMeasureMode;
        if (multiMeasureMode) {
            if (selectedMeasures.size && !selectedMeasures.has(singleMeasure)) {
                value.singleMeasure = selectedMeasures.first();
            }
        }
        else {
            value.selectedMeasures = addToSetInOrder(dataCube.measures.map(function (m) { return m.name; }), value.selectedMeasures, singleMeasure);
        }
        return new Essence(value);
    };
    Essence.prototype.changeSingleMeasure = function (measure) {
        if (measure.name === this.singleMeasure)
            return this;
        var value = this.valueOf();
        value.singleMeasure = measure.name;
        value.splits = value.splits.changeSortIfOnMeasure(this.singleMeasure, measure.name);
        value.pinnedSort = measure.name;
        return new Essence(value);
    };
    Essence.prototype.toggleSelectedMeasure = function (measure) {
        var dataCube = this.dataCube;
        var value = this.valueOf();
        var selectedMeasures = value.selectedMeasures;
        var measureName = measure.name;
        if (selectedMeasures.has(measureName)) {
            value.selectedMeasures = selectedMeasures.delete(measureName);
        }
        else {
            value.selectedMeasures = addToSetInOrder(dataCube.measures.map(function (m) { return m.name; }), selectedMeasures, measureName);
        }
        return new Essence(value);
    };
    Essence.prototype.toggleEffectiveMeasure = function (measure) {
        if (this.getEffectiveMultiMeasureMode()) {
            return this.toggleSelectedMeasure(measure);
        }
        else {
            return this.changeSingleMeasure(measure);
        }
    };
    Essence.prototype.acceptHighlight = function () {
        var highlight = this.highlight;
        if (!highlight)
            return this;
        return this.changeFilter(highlight.applyToFilter(this.filter), true);
    };
    Essence.prototype.changeHighlight = function (owner, measure, delta) {
        var highlight = this.highlight;
        var value;
        if (highlight && highlight.owner !== owner) {
            value = this.changeFilter(highlight.applyToFilter(this.filter)).valueOf();
        }
        else {
            value = this.valueOf();
        }
        value.highlight = new highlight_1.Highlight({
            owner: owner,
            delta: delta,
            measure: measure
        });
        return new Essence(value);
    };
    Essence.prototype.dropHighlight = function () {
        var value = this.valueOf();
        value.highlight = null;
        return new Essence(value);
    };
    return Essence;
}());
exports.Essence = Essence;
check = Essence;
