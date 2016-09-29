"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./dimension-modal.css');
var React = require('react');
var dom_1 = require('../../utils/dom/dom');
var index_1 = require('../../components/index');
var index_2 = require('../../../common/models/index');
var labels_1 = require('../../../common/models/labels');
var immutable_form_delegate_1 = require('../../utils/immutable-form-delegate/immutable-form-delegate');
var DimensionModal = (function (_super) {
    __extends(DimensionModal, _super);
    function DimensionModal() {
        _super.call(this);
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    DimensionModal.prototype.initStateFromProps = function (props) {
        if (props.dimension) {
            this.setState({
                newInstance: new index_2.Dimension(props.dimension.valueOf()),
                canSave: false,
                errors: {}
            });
        }
    };
    DimensionModal.prototype.componentWillReceiveProps = function (nextProps) {
        this.initStateFromProps(nextProps);
    };
    DimensionModal.prototype.componentDidMount = function () {
        this.initStateFromProps(this.props);
    };
    DimensionModal.prototype.save = function () {
        if (!this.state.canSave)
            return;
        this.props.onSave(this.state.newInstance);
    };
    DimensionModal.prototype.render = function () {
        var dimension = this.props.dimension;
        var _a = this.state, newInstance = _a.newInstance, canSave = _a.canSave, errors = _a.errors;
        var saveButtonDisabled = !canSave || dimension.equals(newInstance);
        if (!newInstance)
            return null;
        var isTime = newInstance.kind === 'time';
        var isContinuous = newInstance.isContinuous();
        var makeLabel = index_1.FormLabel.simpleGenerator(labels_1.DIMENSION, errors, true);
        var makeTextInput = index_1.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        var makeDropDownInput = index_1.ImmutableDropdown.simpleGenerator(newInstance, this.delegate.onChange);
        return React.createElement(index_1.Modal, {className: "dimension-modal", title: dimension.title, onClose: this.props.onClose, onEnter: this.save.bind(this)}, 
            React.createElement("form", {className: "general vertical"}, 
                makeLabel('title'), 
                makeTextInput('title', /^.+$/, true), 
                makeLabel('kind'), 
                makeDropDownInput('kind', DimensionModal.KINDS), 
                makeLabel('formula'), 
                makeTextInput('formula'), 
                makeLabel('url'), 
                makeTextInput('url'), 
                isTime ? makeLabel('granularities') : null, 
                isTime ? React.createElement(index_1.ImmutableInput, {instance: newInstance, path: 'granularities', onChange: this.delegate.onChange, valueToString: function (value) { return value ? value.map(index_2.granularityToString).join(', ') : undefined; }, stringToValue: function (str) { return str.split(/\s*,\s*/).map(index_2.granularityFromJS); }}) : null, 
                isContinuous ? makeLabel('bucketingStrategy') : null, 
                isContinuous ? makeDropDownInput('bucketingStrategy', DimensionModal.BUCKETING_STRATEGIES) : null), 
            React.createElement("div", {className: "button-bar"}, 
                React.createElement(index_1.Button, {className: dom_1.classNames("save", { disabled: saveButtonDisabled }), title: "OK", type: "primary", onClick: this.save.bind(this)}), 
                React.createElement(index_1.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: this.props.onClose})));
    };
    DimensionModal.KINDS = [
        { label: 'Time', value: 'time' },
        { label: 'String', value: 'string' },
        { label: 'Boolean', value: 'boolean' },
        { label: 'String-geo', value: 'string-geo' }
    ];
    DimensionModal.BUCKETING_STRATEGIES = [
        { label: 'Bucket', value: index_2.Dimension.defaultBucket },
        { label: 'Don’t Bucket', value: index_2.Dimension.defaultNoBucket }
    ];
    return DimensionModal;
}(React.Component));
exports.DimensionModal = DimensionModal;
