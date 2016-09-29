"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./general.css');
var chronoshift_1 = require('chronoshift');
var React = require('react');
var form_label_1 = require('../../../components/form-label/form-label');
var button_1 = require('../../../components/button/button');
var immutable_input_1 = require('../../../components/immutable-input/immutable-input');
var labels_1 = require('../../../../common/models/labels');
var immutable_form_delegate_1 = require('../../../utils/immutable-form-delegate/immutable-form-delegate');
var General = (function (_super) {
    __extends(General, _super);
    function General() {
        _super.call(this);
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    General.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.settings)
            this.setState({
                newInstance: nextProps.settings,
                errors: {}
            });
    };
    General.prototype.save = function () {
        if (this.props.onSave) {
            this.props.onSave(this.state.newInstance);
        }
    };
    General.prototype.parseTimezones = function (str) {
        return str.split(/\s*,\s*/)
            .map(chronoshift_1.Timezone.fromJS);
    };
    General.prototype.render = function () {
        var _a = this.state, canSave = _a.canSave, newInstance = _a.newInstance, errors = _a.errors;
        if (!newInstance)
            return null;
        var makeLabel = form_label_1.FormLabel.simpleGenerator(labels_1.GENERAL, errors);
        var makeTextInput = immutable_input_1.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        return React.createElement("div", {className: "general"}, 
            React.createElement("div", {className: "title-bar"}, 
                React.createElement("div", {className: "title"}, "General"), 
                canSave ? React.createElement(button_1.Button, {className: "save", title: "Save", type: "primary", onClick: this.save.bind(this)}) : null), 
            React.createElement("div", {className: "content"}, 
                React.createElement("form", {className: "vertical"}, 
                    makeLabel('customization.title'), 
                    makeTextInput('customization.title', /^.+$/, true), 
                    makeLabel('customization.timezones'), 
                    React.createElement(immutable_input_1.ImmutableInput, {instance: newInstance, path: 'customization.timezones', onChange: this.delegate.onChange, valueToString: function (value) { return value ? value.join(', ') : undefined; }, stringToValue: this.parseTimezones.bind(this)}))
            ));
    };
    return General;
}(React.Component));
exports.General = General;
