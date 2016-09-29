"use strict";
var Q = require('q');
var immutable_1 = require('immutable');
var immutable_class_1 = require('immutable-class');
var chronoshift_1 = require('chronoshift');
var plywood_1 = require('plywood');
var general_1 = require('../../utils/general/general');
var time_1 = require('../../utils/time/time');
var dimension_1 = require('../dimension/dimension');
var measure_1 = require('../measure/measure');
var filter_clause_1 = require('../filter-clause/filter-clause');
var filter_1 = require('../filter/filter');
var splits_1 = require('../splits/splits');
var refresh_rule_1 = require('../refresh-rule/refresh-rule');
function formatTimeDiff(diff) {
    diff = Math.round(Math.abs(diff) / 1000);
    if (diff < 60)
        return 'less than 1 minute';
    diff = Math.floor(diff / 60);
    if (diff === 1)
        return '1 minute';
    if (diff < 60)
        return diff + ' minutes';
    diff = Math.floor(diff / 60);
    if (diff === 1)
        return '1 hour';
    if (diff <= 24)
        return diff + ' hours';
    diff = Math.floor(diff / 24);
    return diff + ' days';
}
function checkUnique(dimensions, measures, dataCubeName) {
    var seenDimensions = {};
    var seenMeasures = {};
    if (dimensions) {
        dimensions.forEach(function (d) {
            var dimensionName = d.name.toLowerCase();
            if (seenDimensions[dimensionName])
                throw new Error("duplicate dimension name '" + d.name + "' found in data cube: '" + dataCubeName + "'");
            seenDimensions[dimensionName] = 1;
        });
    }
    if (measures) {
        measures.forEach(function (m) {
            var measureName = m.name.toLowerCase();
            if (seenMeasures[measureName])
                throw new Error("duplicate measure name '" + m.name + "' found in data cube: '" + dataCubeName + "'");
            if (seenDimensions[measureName])
                throw new Error("name '" + m.name + "' found in both dimensions and measures in data cube: '" + dataCubeName + "'");
            seenMeasures[measureName] = 1;
        });
    }
}
function measuresFromLongForm(longForm) {
    var metricColumn = longForm.metricColumn, measures = longForm.measures, possibleAggregates = longForm.possibleAggregates;
    var myPossibleAggregates = {};
    for (var agg in possibleAggregates) {
        if (!general_1.hasOwnProperty(possibleAggregates, agg))
            continue;
        myPossibleAggregates[agg] = plywood_1.Expression.fromJSLoose(possibleAggregates[agg]);
    }
    return measures.map(function (measure) {
        if (general_1.hasOwnProperty(measure, 'name')) {
            return measure_1.Measure.fromJS(measure);
        }
        var title = measure.title;
        if (!title) {
            throw new Error('must have title in longForm value');
        }
        var value = measure.value;
        var aggregate = measure.aggregate;
        if (!aggregate) {
            throw new Error('must have aggregates in longForm value');
        }
        var myExpression = myPossibleAggregates[aggregate];
        if (!myExpression)
            throw new Error("can not find aggregate " + aggregate + " for value " + value);
        var name = general_1.makeUrlSafeName(aggregate + "_" + value);
        return new measure_1.Measure({
            name: name,
            title: title,
            units: measure.units,
            formula: myExpression.substitute(function (ex) {
                if (ex instanceof plywood_1.RefExpression && ex.name === 'filtered') {
                    return plywood_1.$('main').filter(plywood_1.$(metricColumn).is(plywood_1.r(value)));
                }
                return null;
            }).toString()
        });
    });
}
function filterFromLongForm(longForm) {
    var metricColumn = longForm.metricColumn, measures = longForm.measures;
    var values = [];
    for (var _i = 0, measures_1 = measures; _i < measures_1.length; _i++) {
        var measure = measures_1[_i];
        if (general_1.hasOwnProperty(measure, 'aggregate'))
            values.push(measure.value);
    }
    return plywood_1.$(metricColumn).in(values).simplify();
}
var check;
var DataCube = (function () {
    function DataCube(parameters) {
        var name = parameters.name;
        if (typeof name !== 'string')
            throw new Error("DataCube must have a name");
        general_1.verifyUrlSafeName(name);
        this.name = name;
        this.title = parameters.title;
        this.description = parameters.description || '';
        this.clusterName = parameters.clusterName || 'druid';
        this.source = parameters.source || name;
        this.group = parameters.group || null;
        this.subsetFormula = parameters.subsetFormula;
        this.subsetExpression = parameters.subsetFormula ? plywood_1.Expression.fromJSLoose(parameters.subsetFormula) : plywood_1.Expression.TRUE;
        this.rollup = Boolean(parameters.rollup);
        this.options = parameters.options || {};
        this.introspection = parameters.introspection;
        this.attributes = parameters.attributes || [];
        this.attributeOverrides = parameters.attributeOverrides || [];
        this.derivedAttributes = parameters.derivedAttributes;
        this.timeAttribute = parameters.timeAttribute;
        this.defaultTimezone = parameters.defaultTimezone;
        this.defaultFilter = parameters.defaultFilter;
        this.defaultSplits = parameters.defaultSplits;
        this.defaultDuration = parameters.defaultDuration;
        this.defaultSortMeasure = parameters.defaultSortMeasure;
        this.defaultSelectedMeasures = parameters.defaultSelectedMeasures;
        this.defaultPinnedDimensions = parameters.defaultPinnedDimensions;
        var refreshRule = parameters.refreshRule || refresh_rule_1.RefreshRule.query();
        this.refreshRule = refreshRule;
        this.cluster = parameters.cluster;
        this.executor = parameters.executor;
        var dimensions = parameters.dimensions;
        var measures = parameters.measures;
        checkUnique(dimensions, measures, name);
        this.dimensions = dimensions || immutable_1.List([]);
        this.measures = measures || immutable_1.List([]);
        this._validateDefaults();
    }
    DataCube.isDataCube = function (candidate) {
        return immutable_class_1.isInstanceOf(candidate, DataCube);
    };
    DataCube.queryMaxTime = function (dataCube) {
        if (!dataCube.executor) {
            return Q.reject(new Error('dataCube not ready'));
        }
        var ex = plywood_1.ply().apply('maxTime', plywood_1.$('main').max(dataCube.timeAttribute));
        return dataCube.executor(ex).then(function (dataset) {
            var maxTimeDate = dataset.data[0]['maxTime'];
            if (isNaN(maxTimeDate))
                return null;
            return maxTimeDate;
        });
    };
    DataCube.fromClusterAndExternal = function (name, cluster, external) {
        var dataCube = DataCube.fromJS({
            name: name,
            clusterName: cluster.name,
            source: String(external.source),
            refreshRule: refresh_rule_1.RefreshRule.query().toJS()
        });
        return dataCube.updateCluster(cluster).updateWithExternal(external);
    };
    DataCube.fromJS = function (parameters, context) {
        if (context === void 0) { context = {}; }
        var cluster = context.cluster, executor = context.executor;
        var clusterName = parameters.clusterName;
        var introspection = parameters.introspection;
        var defaultSplitsJS = parameters.defaultSplits;
        var attributeOverrideJSs = parameters.attributeOverrides;
        if (!clusterName) {
            clusterName = parameters.engine;
        }
        var options = parameters.options || {};
        if (options.skipIntrospection) {
            if (!introspection)
                introspection = 'none';
            delete options.skipIntrospection;
        }
        if (options.disableAutofill) {
            if (!introspection)
                introspection = 'no-autofill';
            delete options.disableAutofill;
        }
        if (options.attributeOverrides) {
            if (!attributeOverrideJSs)
                attributeOverrideJSs = options.attributeOverrides;
            delete options.attributeOverrides;
        }
        if (options.defaultSplitDimension) {
            options.defaultSplits = options.defaultSplitDimension;
            delete options.defaultSplitDimension;
        }
        if (options.defaultSplits) {
            if (!defaultSplitsJS)
                defaultSplitsJS = options.defaultSplits;
            delete options.defaultSplits;
        }
        if (introspection && DataCube.INTROSPECTION_VALUES.indexOf(introspection) === -1) {
            throw new Error("invalid introspection value " + introspection + ", must be one of " + DataCube.INTROSPECTION_VALUES.join(', '));
        }
        var refreshRule = parameters.refreshRule ? refresh_rule_1.RefreshRule.fromJS(parameters.refreshRule) : null;
        var timeAttributeName = parameters.timeAttribute;
        if (cluster && cluster.type === 'druid' && !timeAttributeName) {
            timeAttributeName = '__time';
        }
        var timeAttribute = timeAttributeName ? plywood_1.$(timeAttributeName) : null;
        var attributeOverrides = plywood_1.AttributeInfo.fromJSs(attributeOverrideJSs || []);
        var attributes = plywood_1.AttributeInfo.fromJSs(parameters.attributes || []);
        var derivedAttributes = null;
        if (parameters.derivedAttributes) {
            derivedAttributes = plywood_1.Expression.expressionLookupFromJS(parameters.derivedAttributes);
        }
        var dimensions = immutable_1.List((parameters.dimensions || []).map(function (d) { return dimension_1.Dimension.fromJS(d); }));
        var measures = immutable_1.List((parameters.measures || []).map(function (m) { return measure_1.Measure.fromJS(m); }));
        if (timeAttribute && !dimension_1.Dimension.getDimensionByExpression(dimensions, timeAttribute)) {
            dimensions = dimensions.unshift(new dimension_1.Dimension({
                name: timeAttributeName,
                kind: 'time',
                formula: timeAttribute.toString()
            }));
        }
        var subsetFormula = parameters.subsetFormula || parameters.subsetFilter;
        var longForm = parameters.longForm;
        if (longForm) {
            measures = measures.concat(measuresFromLongForm(longForm));
            if (longForm.addSubsetFilter) {
                var subsetExpression = subsetFormula ? plywood_1.Expression.fromJSLoose(parameters.subsetFormula) : plywood_1.Expression.TRUE;
                subsetFormula = JSON.stringify(subsetExpression.and(filterFromLongForm(longForm)).simplify());
            }
        }
        var value = {
            executor: null,
            name: parameters.name,
            title: parameters.title,
            description: parameters.description,
            clusterName: clusterName,
            source: parameters.source,
            group: parameters.group,
            subsetFormula: subsetFormula,
            rollup: parameters.rollup,
            options: options,
            introspection: introspection,
            attributeOverrides: attributeOverrides,
            attributes: attributes,
            derivedAttributes: derivedAttributes,
            dimensions: dimensions,
            measures: measures,
            timeAttribute: timeAttribute,
            defaultTimezone: parameters.defaultTimezone ? chronoshift_1.Timezone.fromJS(parameters.defaultTimezone) : null,
            defaultFilter: parameters.defaultFilter ? filter_1.Filter.fromJS(parameters.defaultFilter) : null,
            defaultSplits: defaultSplitsJS ? splits_1.Splits.fromJS(defaultSplitsJS, { dimensions: dimensions }) : null,
            defaultDuration: parameters.defaultDuration ? chronoshift_1.Duration.fromJS(parameters.defaultDuration) : null,
            defaultSortMeasure: parameters.defaultSortMeasure || (measures.size ? measures.first().name : null),
            defaultSelectedMeasures: parameters.defaultSelectedMeasures ? immutable_1.OrderedSet(parameters.defaultSelectedMeasures) : null,
            defaultPinnedDimensions: parameters.defaultPinnedDimensions ? immutable_1.OrderedSet(parameters.defaultPinnedDimensions) : null,
            refreshRule: refreshRule
        };
        if (cluster) {
            if (clusterName !== cluster.name)
                throw new Error("Cluster name '" + clusterName + "' was given but '" + cluster.name + "' cluster was supplied (must match)");
            value.cluster = cluster;
        }
        if (executor)
            value.executor = executor;
        return new DataCube(value);
    };
    DataCube.prototype.valueOf = function () {
        var value = {
            name: this.name,
            title: this.title,
            description: this.description,
            clusterName: this.clusterName,
            source: this.source,
            group: this.group,
            subsetFormula: this.subsetFormula,
            rollup: this.rollup,
            options: this.options,
            introspection: this.introspection,
            attributeOverrides: this.attributeOverrides,
            attributes: this.attributes,
            derivedAttributes: this.derivedAttributes,
            dimensions: this.dimensions,
            measures: this.measures,
            timeAttribute: this.timeAttribute,
            defaultTimezone: this.defaultTimezone,
            defaultFilter: this.defaultFilter,
            defaultSplits: this.defaultSplits,
            defaultDuration: this.defaultDuration,
            defaultSortMeasure: this.defaultSortMeasure,
            defaultSelectedMeasures: this.defaultSelectedMeasures,
            defaultPinnedDimensions: this.defaultPinnedDimensions,
            refreshRule: this.refreshRule
        };
        if (this.cluster)
            value.cluster = this.cluster;
        if (this.executor)
            value.executor = this.executor;
        return value;
    };
    DataCube.prototype.toJS = function () {
        var js = {
            name: this.name,
            title: this.title,
            description: this.description,
            clusterName: this.clusterName,
            source: this.source,
            dimensions: this.dimensions.toArray().map(function (dimension) { return dimension.toJS(); }),
            measures: this.measures.toArray().map(function (measure) { return measure.toJS(); }),
            refreshRule: this.refreshRule.toJS()
        };
        if (this.group)
            js.group = this.group;
        if (this.introspection)
            js.introspection = this.introspection;
        if (this.subsetFormula)
            js.subsetFormula = this.subsetFormula;
        if (this.defaultTimezone)
            js.defaultTimezone = this.defaultTimezone.toJS();
        if (this.defaultFilter)
            js.defaultFilter = this.defaultFilter.toJS();
        if (this.defaultSplits)
            js.defaultSplits = this.defaultSplits.toJS();
        if (this.defaultDuration)
            js.defaultDuration = this.defaultDuration.toJS();
        if (this.defaultSortMeasure)
            js.defaultSortMeasure = this.defaultSortMeasure;
        if (this.defaultSelectedMeasures)
            js.defaultSelectedMeasures = this.defaultSelectedMeasures.toArray();
        if (this.defaultPinnedDimensions)
            js.defaultPinnedDimensions = this.defaultPinnedDimensions.toArray();
        if (this.rollup)
            js.rollup = true;
        if (this.timeAttribute)
            js.timeAttribute = this.timeAttribute.name;
        if (this.attributeOverrides.length)
            js.attributeOverrides = plywood_1.AttributeInfo.toJSs(this.attributeOverrides);
        if (this.attributes.length)
            js.attributes = plywood_1.AttributeInfo.toJSs(this.attributes);
        if (this.derivedAttributes)
            js.derivedAttributes = plywood_1.Expression.expressionLookupToJS(this.derivedAttributes);
        if (Object.keys(this.options).length)
            js.options = this.options;
        return js;
    };
    DataCube.prototype.toJSON = function () {
        return this.toJS();
    };
    DataCube.prototype.toString = function () {
        return "[DataCube: " + this.name + "]";
    };
    DataCube.prototype.equals = function (other) {
        return DataCube.isDataCube(other) &&
            this.name === other.name &&
            this.title === other.title &&
            this.description === other.description &&
            this.clusterName === other.clusterName &&
            this.source === other.source &&
            this.group === other.group &&
            this.subsetFormula === other.subsetFormula &&
            this.rollup === other.rollup &&
            JSON.stringify(this.options) === JSON.stringify(other.options) &&
            this.introspection === other.introspection &&
            immutable_class_1.immutableArraysEqual(this.attributeOverrides, other.attributeOverrides) &&
            immutable_class_1.immutableArraysEqual(this.attributes, other.attributes) &&
            immutable_class_1.immutableLookupsEqual(this.derivedAttributes, other.derivedAttributes) &&
            general_1.immutableListsEqual(this.dimensions, other.dimensions) &&
            general_1.immutableListsEqual(this.measures, other.measures) &&
            immutable_class_1.immutableEqual(this.timeAttribute, other.timeAttribute) &&
            immutable_class_1.immutableEqual(this.defaultTimezone, other.defaultTimezone) &&
            immutable_class_1.immutableEqual(this.defaultFilter, other.defaultFilter) &&
            immutable_class_1.immutableEqual(this.defaultSplits, other.defaultSplits) &&
            immutable_class_1.immutableEqual(this.defaultDuration, other.defaultDuration) &&
            this.defaultSortMeasure === other.defaultSortMeasure &&
            Boolean(this.defaultSelectedMeasures) === Boolean(other.defaultSelectedMeasures) &&
            (!this.defaultSelectedMeasures || this.defaultSelectedMeasures.equals(other.defaultSelectedMeasures)) &&
            Boolean(this.defaultPinnedDimensions) === Boolean(other.defaultPinnedDimensions) &&
            (!this.defaultPinnedDimensions || this.defaultPinnedDimensions.equals(other.defaultPinnedDimensions)) &&
            this.refreshRule.equals(other.refreshRule);
    };
    DataCube.prototype._validateDefaults = function () {
        var _a = this, measures = _a.measures, defaultSortMeasure = _a.defaultSortMeasure;
        if (defaultSortMeasure) {
            if (!measures.find(function (measure) { return measure.name === defaultSortMeasure; })) {
                throw new Error("can not find defaultSortMeasure '" + defaultSortMeasure + "' in data cube '" + this.name + "'");
            }
        }
    };
    DataCube.prototype.toExternal = function () {
        if (this.clusterName === 'native')
            throw new Error("there is no external on a native data cube");
        var _a = this, cluster = _a.cluster, options = _a.options;
        if (!cluster)
            throw new Error('must have a cluster');
        var externalValue = {
            engine: cluster.type,
            suppress: true,
            source: this.source,
            version: cluster.version,
            derivedAttributes: this.derivedAttributes,
            customAggregations: options.customAggregations,
            customTransforms: options.customTransforms,
            filter: this.subsetExpression
        };
        if (cluster.type === 'druid') {
            externalValue.rollup = this.rollup;
            externalValue.timeAttribute = this.timeAttribute.name;
            externalValue.introspectionStrategy = cluster.getIntrospectionStrategy();
            externalValue.allowSelectQueries = true;
            var externalContext = options.druidContext || {};
            externalContext['timeout'] = cluster.getTimeout();
            if (options.priority)
                externalContext['priority'] = options.priority;
            externalValue.context = externalContext;
        }
        if (this.introspection === 'none') {
            externalValue.attributes = plywood_1.AttributeInfo.override(this.deduceAttributes(), this.attributeOverrides);
            externalValue.derivedAttributes = this.derivedAttributes;
        }
        else {
            externalValue.attributeOverrides = this.attributeOverrides;
        }
        return plywood_1.External.fromValue(externalValue);
    };
    DataCube.prototype.getMainTypeContext = function () {
        var _a = this, attributes = _a.attributes, derivedAttributes = _a.derivedAttributes;
        if (!attributes)
            return null;
        var datasetType = {};
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var attribute = attributes_1[_i];
            datasetType[attribute.name] = attribute;
        }
        for (var name in derivedAttributes) {
            datasetType[name] = {
                type: derivedAttributes[name].type
            };
        }
        return {
            type: 'DATASET',
            datasetType: datasetType
        };
    };
    DataCube.prototype.getIssues = function () {
        var _a = this, dimensions = _a.dimensions, measures = _a.measures;
        var mainTypeContext = this.getMainTypeContext();
        var issues = [];
        dimensions.forEach(function (dimension) {
            try {
                dimension.expression.referenceCheckInTypeContext(mainTypeContext);
            }
            catch (e) {
                issues.push("failed to validate dimension '" + dimension.name + "': " + e.message);
            }
        });
        var measureTypeContext = {
            type: 'DATASET',
            datasetType: {
                main: mainTypeContext
            }
        };
        measures.forEach(function (measure) {
            try {
                measure.expression.referenceCheckInTypeContext(measureTypeContext);
            }
            catch (e) {
                var message = e.message;
                if (measure.expression.getFreeReferences().indexOf('main') === -1) {
                    message = 'measure must contain a $main reference';
                }
                issues.push("failed to validate measure '" + measure.name + "': " + message);
            }
        });
        return issues;
    };
    DataCube.prototype.updateCluster = function (cluster) {
        var value = this.valueOf();
        value.cluster = cluster;
        return new DataCube(value);
    };
    DataCube.prototype.updateWithDataset = function (dataset) {
        if (this.clusterName !== 'native')
            throw new Error('must be native to have a dataset');
        var executor = plywood_1.basicExecutorFactory({
            datasets: { main: dataset }
        });
        return this.addAttributes(dataset.attributes).attachExecutor(executor);
    };
    DataCube.prototype.updateWithExternal = function (external) {
        if (this.clusterName === 'native')
            throw new Error('can not be native and have an external');
        var executor = plywood_1.basicExecutorFactory({
            datasets: { main: external }
        });
        return this.addAttributes(external.attributes).attachExecutor(executor);
    };
    DataCube.prototype.attachExecutor = function (executor) {
        var value = this.valueOf();
        value.executor = executor;
        return new DataCube(value);
    };
    DataCube.prototype.toClientDataCube = function () {
        var value = this.valueOf();
        value.subsetFormula = null;
        value.introspection = null;
        value.attributeOverrides = null;
        value.options = null;
        return new DataCube(value);
    };
    DataCube.prototype.isQueryable = function () {
        return Boolean(this.executor);
    };
    DataCube.prototype.getMaxTime = function (timekeeper) {
        var _a = this, name = _a.name, refreshRule = _a.refreshRule;
        if (refreshRule.isRealtime()) {
            return timekeeper.now();
        }
        else if (refreshRule.isFixed()) {
            return refreshRule.time;
        }
        else {
            return timekeeper.getTime(name);
        }
    };
    DataCube.prototype.updatedText = function (timekeeper, timezone) {
        var refreshRule = this.refreshRule;
        if (refreshRule.isRealtime()) {
            return 'Updated ~1 second ago';
        }
        else if (refreshRule.isFixed()) {
            return "Fixed to " + time_1.getWallTimeString(refreshRule.time, timezone, true);
        }
        else {
            var maxTime = this.getMaxTime(timekeeper);
            if (maxTime) {
                return "Updated " + formatTimeDiff(timekeeper.now().valueOf() - maxTime.valueOf().valueOf()) + " ago";
            }
            else {
                return null;
            }
        }
    };
    DataCube.prototype.getDimension = function (dimensionName) {
        return dimension_1.Dimension.getDimension(this.dimensions, dimensionName);
    };
    DataCube.prototype.getDimensionByExpression = function (expression) {
        return dimension_1.Dimension.getDimensionByExpression(this.dimensions, expression);
    };
    DataCube.prototype.getDimensionByKind = function (kind) {
        return this.dimensions.filter(function (d) { return d.kind === kind; });
    };
    DataCube.prototype.getTimeDimension = function () {
        return this.getDimensionByExpression(this.timeAttribute);
    };
    DataCube.prototype.isTimeAttribute = function (ex) {
        return ex.equals(this.timeAttribute);
    };
    DataCube.prototype.getMeasure = function (measureName) {
        return measure_1.Measure.getMeasure(this.measures, measureName);
    };
    DataCube.prototype.getMeasureByExpression = function (expression) {
        return this.measures.find(function (measure) { return measure.expression.equals(expression); });
    };
    DataCube.prototype.changeDimensions = function (dimensions) {
        var value = this.valueOf();
        value.dimensions = dimensions;
        return new DataCube(value);
    };
    DataCube.prototype.rolledUp = function () {
        return this.clusterName === 'druid';
    };
    DataCube.prototype.deduceAttributes = function () {
        var _a = this, dimensions = _a.dimensions, measures = _a.measures, timeAttribute = _a.timeAttribute, attributeOverrides = _a.attributeOverrides;
        var attributes = [];
        if (timeAttribute) {
            attributes.push(plywood_1.AttributeInfo.fromJS({ name: timeAttribute.name, type: 'TIME' }));
        }
        dimensions.forEach(function (dimension) {
            var expression = dimension.expression;
            if (expression.equals(timeAttribute))
                return;
            var references = expression.getFreeReferences();
            for (var _i = 0, references_1 = references; _i < references_1.length; _i++) {
                var reference = references_1[_i];
                if (plywood_1.findByName(attributes, reference))
                    continue;
                attributes.push(plywood_1.AttributeInfo.fromJS({ name: reference, type: 'STRING' }));
            }
        });
        measures.forEach(function (measure) {
            var expression = measure.expression;
            var references = measure_1.Measure.getAggregateReferences(expression);
            var countDistinctReferences = measure_1.Measure.getCountDistinctReferences(expression);
            for (var _i = 0, references_2 = references; _i < references_2.length; _i++) {
                var reference = references_2[_i];
                if (plywood_1.findByName(attributes, reference))
                    continue;
                if (countDistinctReferences.indexOf(reference) !== -1) {
                    attributes.push(plywood_1.AttributeInfo.fromJS({ name: reference, special: 'unique' }));
                }
                else {
                    attributes.push(plywood_1.AttributeInfo.fromJS({ name: reference, type: 'NUMBER' }));
                }
            }
        });
        if (attributeOverrides.length) {
            attributes = plywood_1.AttributeInfo.override(attributes, attributeOverrides);
        }
        return attributes;
    };
    DataCube.prototype.addAttributes = function (newAttributes) {
        var _this = this;
        var _a = this, dimensions = _a.dimensions, measures = _a.measures, attributes = _a.attributes;
        var introspection = this.getIntrospection();
        if (introspection === 'none')
            return this;
        var autofillDimensions = introspection === 'autofill-dimensions-only' || introspection === 'autofill-all';
        var autofillMeasures = introspection === 'autofill-measures-only' || introspection === 'autofill-all';
        var $main = plywood_1.$('main');
        for (var _i = 0, newAttributes_1 = newAttributes; _i < newAttributes_1.length; _i++) {
            var newAttribute = newAttributes_1[_i];
            var name = newAttribute.name, type = newAttribute.type, special = newAttribute.special;
            if (attributes && plywood_1.findByName(attributes, name))
                continue;
            var urlSafeName = general_1.makeUrlSafeName(name);
            if (this.getDimension(urlSafeName) || this.getMeasure(urlSafeName))
                continue;
            var expression;
            switch (type) {
                case 'TIME':
                    if (!autofillDimensions)
                        continue;
                    expression = plywood_1.$(name);
                    if (this.getDimensionByExpression(expression))
                        continue;
                    dimensions = dimensions.unshift(new dimension_1.Dimension({
                        name: urlSafeName,
                        kind: 'time',
                        formula: expression.toString()
                    }));
                    break;
                case 'STRING':
                    if (special === 'unique' || special === 'theta') {
                        if (!autofillMeasures)
                            continue;
                        var newMeasures = measure_1.Measure.measuresFromAttributeInfo(newAttribute);
                        newMeasures.forEach(function (newMeasure) {
                            if (_this.getMeasureByExpression(newMeasure.expression))
                                return;
                            measures = measures.push(newMeasure);
                        });
                    }
                    else {
                        if (!autofillDimensions)
                            continue;
                        expression = plywood_1.$(name);
                        if (this.getDimensionByExpression(expression))
                            continue;
                        dimensions = dimensions.push(new dimension_1.Dimension({
                            name: urlSafeName,
                            formula: expression.toString()
                        }));
                    }
                    break;
                case 'SET/STRING':
                    if (!autofillDimensions)
                        continue;
                    expression = plywood_1.$(name);
                    if (this.getDimensionByExpression(expression))
                        continue;
                    dimensions = dimensions.push(new dimension_1.Dimension({
                        name: urlSafeName,
                        formula: expression.toString()
                    }));
                    break;
                case 'BOOLEAN':
                    if (!autofillDimensions)
                        continue;
                    expression = plywood_1.$(name);
                    if (this.getDimensionByExpression(expression))
                        continue;
                    dimensions = dimensions.push(new dimension_1.Dimension({
                        name: urlSafeName,
                        kind: 'boolean',
                        formula: expression.toString()
                    }));
                    break;
                case 'NUMBER':
                    if (!autofillMeasures)
                        continue;
                    var newMeasures = measure_1.Measure.measuresFromAttributeInfo(newAttribute);
                    newMeasures.forEach(function (newMeasure) {
                        if (_this.getMeasureByExpression(newMeasure.expression))
                            return;
                        measures = (name === 'count') ? measures.unshift(newMeasure) : measures.push(newMeasure);
                    });
                    break;
                default:
                    throw new Error("unsupported type " + type);
            }
        }
        if (!this.rolledUp() && !measures.find(function (m) { return m.name === 'count'; })) {
            measures = measures.unshift(new measure_1.Measure({
                name: 'count',
                formula: $main.count().toString()
            }));
        }
        var value = this.valueOf();
        value.attributes = attributes ? plywood_1.AttributeInfo.override(attributes, newAttributes) : newAttributes;
        value.dimensions = dimensions;
        value.measures = measures;
        if (!value.defaultSortMeasure) {
            value.defaultSortMeasure = measures.size ? measures.first().name : null;
        }
        if (!value.timeAttribute && dimensions.size && dimensions.first().kind === 'time') {
            value.timeAttribute = dimensions.first().expression;
        }
        return new DataCube(value);
    };
    DataCube.prototype.getIntrospection = function () {
        return this.introspection || DataCube.DEFAULT_INTROSPECTION;
    };
    DataCube.prototype.getDefaultTimezone = function () {
        return this.defaultTimezone || DataCube.DEFAULT_DEFAULT_TIMEZONE;
    };
    DataCube.prototype.getDefaultFilter = function () {
        var filter = this.defaultFilter || DataCube.DEFAULT_DEFAULT_FILTER;
        if (this.timeAttribute) {
            filter = filter.setSelection(this.timeAttribute, plywood_1.$(filter_clause_1.FilterClause.MAX_TIME_REF_NAME).timeRange(this.getDefaultDuration(), -1));
        }
        return filter;
    };
    DataCube.prototype.getDefaultSplits = function () {
        return this.defaultSplits || DataCube.DEFAULT_DEFAULT_SPLITS;
    };
    DataCube.prototype.getDefaultDuration = function () {
        return this.defaultDuration || DataCube.DEFAULT_DEFAULT_DURATION;
    };
    DataCube.prototype.getDefaultSortMeasure = function () {
        if (this.defaultSortMeasure) {
            return this.defaultSortMeasure;
        }
        if (this.measures.size > 0) {
            this.measures.first().name;
        }
        return null;
    };
    DataCube.prototype.getDefaultSelectedMeasures = function () {
        return this.defaultSelectedMeasures || immutable_1.OrderedSet(this.measures.slice(0, 4).map(function (m) { return m.name; }));
    };
    DataCube.prototype.getDefaultPinnedDimensions = function () {
        return this.defaultPinnedDimensions || immutable_1.OrderedSet([]);
    };
    DataCube.prototype.change = function (propertyName, newValue) {
        var v = this.valueOf();
        if (!v.hasOwnProperty(propertyName)) {
            throw new Error("Unknown property : " + propertyName);
        }
        v[propertyName] = newValue;
        return new DataCube(v);
    };
    DataCube.prototype.changeDefaultSortMeasure = function (defaultSortMeasure) {
        return this.change('defaultSortMeasure', defaultSortMeasure);
    };
    DataCube.prototype.changeTitle = function (title) {
        return this.change('title', title);
    };
    DataCube.prototype.changeDescription = function (description) {
        return this.change('description', description);
    };
    DataCube.prototype.changeMeasures = function (measures) {
        return this.change('measures', measures);
    };
    DataCube.prototype.getDefaultSortAction = function () {
        return new plywood_1.SortAction({
            expression: plywood_1.$(this.defaultSortMeasure),
            direction: plywood_1.SortAction.DESCENDING
        });
    };
    DataCube.prototype.sameGroup = function (otherDataCube) {
        return Boolean(this.group && this.group === otherDataCube.group);
    };
    DataCube.DEFAULT_INTROSPECTION = 'autofill-all';
    DataCube.INTROSPECTION_VALUES = ['none', 'no-autofill', 'autofill-dimensions-only', 'autofill-measures-only', 'autofill-all'];
    DataCube.DEFAULT_DEFAULT_TIMEZONE = chronoshift_1.Timezone.UTC;
    DataCube.DEFAULT_DEFAULT_FILTER = filter_1.Filter.EMPTY;
    DataCube.DEFAULT_DEFAULT_SPLITS = splits_1.Splits.EMPTY;
    DataCube.DEFAULT_DEFAULT_DURATION = chronoshift_1.Duration.fromJS('P1D');
    return DataCube;
}());
exports.DataCube = DataCube;
check = DataCube;
