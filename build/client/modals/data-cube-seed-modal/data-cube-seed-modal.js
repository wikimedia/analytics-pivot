"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./data-cube-seed-modal.css');
var React = require('react');
var index_1 = require("../../../common/models/index");
var index_2 = require('../../components/index');
var constants_1 = require("../../config/constants");
var labels_1 = require('../../../common/models/labels');
var string_1 = require('../../../common/utils/string/string');
var array_1 = require('../../../common/utils/array/array');
var immutable_form_delegate_1 = require('../../utils/immutable-form-delegate/immutable-form-delegate');
var DataCubeSeedModal = (function (_super) {
    __extends(DataCubeSeedModal, _super);
    function DataCubeSeedModal() {
        _super.call(this);
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    DataCubeSeedModal.prototype.initFromProps = function (props) {
        var dataCubes = props.dataCubes, clusters = props.clusters;
        if (!dataCubes)
            return;
        var clusterName = clusters.length ? clusters[0].name : 'native';
        this.setState({
            newInstance: new index_1.DataCube({
                name: string_1.generateUniqueName('dc', function (name) { return array_1.indexByAttribute(dataCubes, 'name', name) === -1; }),
                clusterName: clusterName,
                source: ''
            })
        });
    };
    DataCubeSeedModal.prototype.componentWillreceiveProps = function (nextProps) {
        this.initFromProps(nextProps);
    };
    DataCubeSeedModal.prototype.componentDidMount = function () {
        this.initFromProps(this.props);
    };
    DataCubeSeedModal.prototype.onNext = function () {
        this.props.onNext(this.state.newInstance, this.state.autoFill);
    };
    DataCubeSeedModal.prototype.toggleAutoFill = function () {
        this.setState({
            autoFill: !this.state.autoFill
        });
    };
    DataCubeSeedModal.prototype.render = function () {
        var _a = this.props, onNext = _a.onNext, onCancel = _a.onCancel;
        var _b = this.state, newInstance = _b.newInstance, errors = _b.errors, autoFill = _b.autoFill;
        if (!newInstance)
            return null;
        var makeLabel = index_2.FormLabel.simpleGenerator(labels_1.DATA_CUBE, errors, true);
        var makeTextInput = index_2.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        var makeDropDownInput = index_2.ImmutableDropdown.simpleGenerator(newInstance, this.delegate.onChange);
        return React.createElement(index_2.Modal, {className: "data-cube-seed-modal", title: constants_1.STRINGS.createDataCube, onClose: this.props.onCancel}, 
            React.createElement("form", null, 
                makeLabel('source'), 
                makeDropDownInput('source', []), 
                React.createElement(index_2.Checkbox, {selected: autoFill, onClick: this.toggleAutoFill.bind(this), label: constants_1.STRINGS.autoFillDimensionsAndMeasures})), 
            React.createElement("div", {className: "button-bar"}, 
                React.createElement(index_2.Button, {type: "primary", title: constants_1.STRINGS.next + ": " + constants_1.STRINGS.configureDataCube, onClick: this.onNext.bind(this)}), 
                React.createElement(index_2.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: onCancel})));
    };
    return DataCubeSeedModal;
}(React.Component));
exports.DataCubeSeedModal = DataCubeSeedModal;
