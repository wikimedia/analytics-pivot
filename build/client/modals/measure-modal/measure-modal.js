"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./measure-modal.css');
var React = require('react');
var dom_1 = require('../../utils/dom/dom');
var index_1 = require('../../components/index');
var index_2 = require('../../../common/models/index');
var labels_1 = require('../../../common/models/labels');
var immutable_form_delegate_1 = require('../../utils/immutable-form-delegate/immutable-form-delegate');
var MeasureModal = (function (_super) {
    __extends(MeasureModal, _super);
    function MeasureModal() {
        _super.call(this);
        this.hasInitialized = false;
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    MeasureModal.prototype.initStateFromProps = function (props) {
        if (props.measure) {
            this.setState({
                newInstance: new index_2.Measure(props.measure.valueOf()),
                canSave: false
            });
        }
    };
    MeasureModal.prototype.componentWillReceiveProps = function (nextProps) {
        this.initStateFromProps(nextProps);
    };
    MeasureModal.prototype.componentDidMount = function () {
        this.initStateFromProps(this.props);
    };
    MeasureModal.prototype.save = function () {
        if (!this.state.canSave)
            return;
        this.props.onSave(this.state.newInstance);
    };
    MeasureModal.prototype.render = function () {
        var measure = this.props.measure;
        var _a = this.state, newInstance = _a.newInstance, canSave = _a.canSave, errors = _a.errors;
        var saveButtonDisabled = !canSave || measure.equals(newInstance);
        if (!newInstance)
            return null;
        var makeLabel = index_1.FormLabel.simpleGenerator(labels_1.MEASURE, errors, true);
        var makeTextInput = index_1.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        var makeDropDownInput = index_1.ImmutableDropdown.simpleGenerator(newInstance, this.delegate.onChange);
        return React.createElement(index_1.Modal, {className: "dimension-modal", title: measure.title, onClose: this.props.onClose, onEnter: this.save.bind(this)}, 
            React.createElement("form", {className: "general vertical"}, 
                makeLabel('title'), 
                makeTextInput('title', /^.+$/, true), 
                makeLabel('units'), 
                makeTextInput('units'), 
                makeLabel('formula'), 
                makeTextInput('formula')), 
            React.createElement("div", {className: "button-bar"}, 
                React.createElement(index_1.Button, {className: dom_1.classNames("save", { disabled: saveButtonDisabled }), title: "OK", type: "primary", onClick: this.save.bind(this)}), 
                React.createElement(index_1.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: this.props.onClose})));
    };
    return MeasureModal;
}(React.Component));
exports.MeasureModal = MeasureModal;
