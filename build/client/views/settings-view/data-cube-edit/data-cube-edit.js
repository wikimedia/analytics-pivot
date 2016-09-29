"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./data-cube-edit.css');
var React = require('react');
var plywood_1 = require('plywood');
var dom_1 = require('../../../utils/dom/dom');
var constants_1 = require('../../../config/constants');
var string_1 = require('../../../../common/utils/string/string');
var chronoshift_1 = require('chronoshift');
var constants_2 = require('../../../config/constants');
var index_1 = require('../../../components/index');
var index_2 = require('../../../modals/index');
var index_3 = require('../../../../common/models/index');
var labels_1 = require('../../../../common/models/labels');
var immutable_form_delegate_1 = require('../../../utils/immutable-form-delegate/immutable-form-delegate');
var DataCubeEdit = (function (_super) {
    __extends(DataCubeEdit, _super);
    function DataCubeEdit() {
        _super.call(this);
        this.tabs = [
            { label: 'General', value: 'general', render: this.renderGeneral },
            { label: 'Attributes', value: 'attributes', render: this.renderAttributes },
            { label: 'Dimensions', value: 'dimensions', render: this.renderDimensions },
            { label: 'Measures', value: 'measures', render: this.renderMeasures }
        ];
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    DataCubeEdit.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.dataCube) {
            this.initFromProps(nextProps);
        }
    };
    DataCubeEdit.prototype.componentDidMount = function () {
        if (this.props.dataCube)
            this.initFromProps(this.props);
    };
    DataCubeEdit.prototype.initFromProps = function (props) {
        this.setState({
            newInstance: new index_3.DataCube(props.dataCube.valueOf()),
            canSave: true,
            errors: {},
            tab: props.isNewDataCube ? this.tabs[0] : this.tabs.filter(function (tab) { return tab.value === props.tab; })[0]
        });
    };
    DataCubeEdit.prototype.selectTab = function (tab) {
        if (this.props.isNewDataCube) {
            this.setState({ tab: tab });
        }
        else {
            var hash = window.location.hash.split('/');
            hash.splice(-1);
            window.location.hash = hash.join('/') + '/' + tab;
        }
    };
    DataCubeEdit.prototype.renderTabs = function (activeTab) {
        var _this = this;
        return this.tabs.map(function (tab) {
            return React.createElement("button", {className: dom_1.classNames({ active: activeTab.value === tab.value }), key: tab.value, onClick: _this.selectTab.bind(_this, tab)}, tab.label);
        });
    };
    DataCubeEdit.prototype.cancel = function () {
        var _this = this;
        var isNewDataCube = this.props.isNewDataCube;
        if (isNewDataCube) {
            this.props.onCancel();
            return;
        }
        this.setState({ newInstance: undefined }, function () { return _this.initFromProps(_this.props); });
    };
    DataCubeEdit.prototype.save = function () {
        if (this.props.onSave)
            this.props.onSave(this.state.newInstance);
    };
    DataCubeEdit.prototype.goBack = function () {
        var _a = this.props, dataCube = _a.dataCube, tab = _a.tab;
        var hash = window.location.hash;
        window.location.hash = hash.replace("/" + dataCube.name + "/" + tab, '');
    };
    DataCubeEdit.prototype.getIntrospectionStrategies = function () {
        var labels = constants_2.DATA_CUBES_STRATEGIES_LABELS;
        return [{
                label: "Default (" + labels[index_3.DataCube.DEFAULT_INTROSPECTION] + ")",
                value: undefined
            }].concat(index_3.DataCube.INTROSPECTION_VALUES.map(function (value) {
            return { value: value, label: labels[value] };
        }));
    };
    DataCubeEdit.prototype.renderGeneral = function () {
        var clusters = this.props.clusters;
        var _a = this.state, newInstance = _a.newInstance, errors = _a.errors;
        var makeLabel = index_1.FormLabel.simpleGenerator(labels_1.DATA_CUBE, errors);
        var makeTextInput = index_1.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        var makeDropDownInput = index_1.ImmutableDropdown.simpleGenerator(newInstance, this.delegate.onChange);
        var possibleClusters = [
            { value: 'native', label: 'Load a file and serve it natively' }
        ].concat(clusters.map(function (cluster) {
            return { value: cluster.name, label: cluster.name };
        }));
        return React.createElement("form", {className: "general vertical"}, 
            makeLabel('title'), 
            makeTextInput('title', /.*/, true), 
            makeLabel('description'), 
            makeTextInput('description'), 
            makeLabel('clusterName'), 
            makeDropDownInput('clusterName', possibleClusters), 
            makeLabel('source'), 
            makeTextInput('source'), 
            makeLabel('defaultTimezone'), 
            React.createElement(index_1.ImmutableInput, {instance: newInstance, path: 'defaultTimezone', onChange: this.delegate.onChange, valueToString: function (value) { return value ? value.toJS() : undefined; }, stringToValue: function (str) { return str ? chronoshift_1.Timezone.fromJS(str) : undefined; }}));
    };
    DataCubeEdit.prototype.renderAttributes = function () {
        var _a = this.state, newInstance = _a.newInstance, errors = _a.errors;
        var makeLabel = index_1.FormLabel.simpleGenerator(labels_1.DATA_CUBE, errors);
        return React.createElement("form", {className: "general vertical"}, 
            makeLabel('attributeOverrides'), 
            React.createElement(index_1.ImmutableInput, {instance: newInstance, path: 'attributeOverrides', onChange: this.delegate.onChange, valueToString: function (value) { return value ? JSON.stringify(plywood_1.AttributeInfo.toJSs(value), null, 2) : undefined; }, stringToValue: function (str) { return str ? plywood_1.AttributeInfo.fromJSs(JSON.parse(str)) : undefined; }, type: "textarea"}));
    };
    DataCubeEdit.prototype.renderDimensions = function () {
        var _this = this;
        var newInstance = this.state.newInstance;
        var onChange = function (newDimensions) {
            var newCube = newInstance.changeDimensions(newDimensions);
            _this.setState({
                newInstance: newCube
            });
        };
        var getModal = function (item) { return React.createElement(index_2.DimensionModal, {dimension: item}); };
        var getNewItem = function () { return index_3.Dimension.fromJS({
            name: string_1.generateUniqueName('d', function (name) { return !newInstance.dimensions.find(function (m) { return m.name === name; }); }),
            title: 'New dimension'
        }); };
        var getRows = function (items) { return items.toArray().map(function (dimension) {
            return {
                title: dimension.title,
                description: dimension.expression.toString(),
                icon: "dim-" + dimension.kind
            };
        }); };
        var DimensionsList = index_1.ImmutableList.specialize();
        return React.createElement(DimensionsList, {label: "Dimensions", items: newInstance.dimensions, onChange: onChange.bind(this), getModal: getModal, getNewItem: getNewItem, getRows: getRows});
    };
    DataCubeEdit.prototype.renderMeasures = function () {
        var _this = this;
        var newInstance = this.state.newInstance;
        var onChange = function (newMeasures) {
            var defaultSortMeasure = newInstance.defaultSortMeasure;
            if (defaultSortMeasure) {
                if (!newMeasures.find(function (measure) { return measure.name === defaultSortMeasure; })) {
                    newInstance = newInstance.changeDefaultSortMeasure(newMeasures.get(0).name);
                }
            }
            var newCube = newInstance.changeMeasures(newMeasures);
            _this.setState({
                newInstance: newCube
            });
        };
        var getModal = function (item) { return React.createElement(index_2.MeasureModal, {measure: item}); };
        var getNewItem = function () { return index_3.Measure.fromJS({
            name: string_1.generateUniqueName('m', function (name) { return !newInstance.measures.find(function (m) { return m.name === name; }); }),
            title: 'New measure'
        }); };
        var getRows = function (items) { return items.toArray().map(function (measure) {
            return {
                title: measure.title,
                description: measure.expression.toString(),
                icon: "measure"
            };
        }); };
        var MeasuresList = index_1.ImmutableList.specialize();
        return React.createElement(MeasuresList, {label: "Measures", items: newInstance.measures, onChange: onChange.bind(this), getModal: getModal, getNewItem: getNewItem, getRows: getRows});
    };
    DataCubeEdit.prototype.renderButtons = function () {
        var _a = this.props, dataCube = _a.dataCube, isNewDataCube = _a.isNewDataCube;
        var _b = this.state, canSave = _b.canSave, newInstance = _b.newInstance;
        var hasChanged = !dataCube.equals(newInstance);
        var cancelButton = React.createElement(index_1.Button, {className: "cancel", title: isNewDataCube ? "Cancel" : "Revert changes", type: "secondary", onClick: this.cancel.bind(this)});
        var saveButton = React.createElement(index_1.Button, {className: dom_1.classNames("save", { disabled: !canSave || (!isNewDataCube && !hasChanged) }), title: isNewDataCube ? "Create cube" : "Save", type: "primary", onClick: this.save.bind(this)});
        if (!isNewDataCube && !hasChanged) {
            return React.createElement("div", {className: "button-group"}, saveButton);
        }
        return React.createElement("div", {className: "button-group"}, 
            cancelButton, 
            saveButton);
    };
    DataCubeEdit.prototype.getTitle = function () {
        var isNewDataCube = this.props.isNewDataCube;
        var newInstance = this.state.newInstance;
        var lastBit = newInstance.title ? ": " + newInstance.title : '';
        return (isNewDataCube ? constants_1.STRINGS.createDataCube : constants_1.STRINGS.editDataCube) + lastBit;
    };
    DataCubeEdit.prototype.render = function () {
        var _a = this.props, dataCube = _a.dataCube, isNewDataCube = _a.isNewDataCube;
        var _b = this.state, tab = _b.tab, newInstance = _b.newInstance;
        if (!newInstance || !tab || !dataCube)
            return null;
        return React.createElement("div", {className: "data-cube-edit"}, 
            React.createElement("div", {className: "title-bar"}, 
                isNewDataCube
                    ? null
                    : React.createElement(index_1.Button, {className: "button back", type: "secondary", svg: require('../../../icons/full-back.svg'), onClick: this.goBack.bind(this)}), 
                React.createElement("div", {className: "title"}, this.getTitle()), 
                this.renderButtons()), 
            React.createElement("div", {className: "content"}, 
                React.createElement("div", {className: "tabs"}, this.renderTabs(tab)), 
                React.createElement("div", {className: "tab-content"}, tab.render.bind(this)())));
    };
    return DataCubeEdit;
}(React.Component));
exports.DataCubeEdit = DataCubeEdit;
