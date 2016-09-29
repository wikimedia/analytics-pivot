"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./form-label.css');
var React = require('react');
var svg_icon_1 = require('../svg-icon/svg-icon');
var dom_1 = require('../../utils/dom/dom');
var string_1 = require('../../../common/utils/string/string');
var FormLabel = (function (_super) {
    __extends(FormLabel, _super);
    function FormLabel() {
        _super.call(this);
        this.state = { helpVisible: false };
    }
    FormLabel.dumbLabel = function (label) {
        return React.createElement("div", {className: "form-label"}, 
            React.createElement("div", {className: "label"}, label)
        );
    };
    FormLabel.simpleGenerator = function (labels, errors, isBubble) {
        if (isBubble === void 0) { isBubble = false; }
        return function (name) {
            var myLabels = labels[name] || { label: '', description: '' };
            return React.createElement(FormLabel, {isBubble: isBubble, label: myLabels.label, helpText: myLabels.description, errorText: errors[name]});
        };
    };
    FormLabel.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.errorText) {
            if (!this.state.helpVisible)
                this.setState({ helpVisible: true, hideHelpIfNoError: true });
        }
        else if (this.state.hideHelpIfNoError) {
            this.setState({ helpVisible: false, hideHelpIfNoError: false });
        }
        else {
            this.setState({ hideHelpIfNoError: false });
        }
    };
    FormLabel.prototype.onHelpClick = function () {
        this.setState({ helpVisible: !this.state.helpVisible, hideHelpIfNoError: false });
    };
    FormLabel.prototype.renderIcon = function () {
        var _a = this.props, helpText = _a.helpText, errorText = _a.errorText;
        if (!helpText && !errorText)
            return null;
        var helpVisible = this.state.helpVisible;
        if (errorText) {
            return React.createElement("div", {className: "icon-container error", onClick: this.onHelpClick.bind(this)}, 
                React.createElement(svg_icon_1.SvgIcon, {className: "icon", svg: require("../../icons/help.svg")})
            );
        }
        if (helpVisible) {
            return React.createElement("div", {className: "icon-container visible", onClick: this.onHelpClick.bind(this)}, 
                React.createElement(svg_icon_1.SvgIcon, {className: "icon", svg: require("../../icons/help.svg")})
            );
        }
        return React.createElement("div", {className: "icon-container", onClick: this.onHelpClick.bind(this)}, 
            React.createElement(svg_icon_1.SvgIcon, {className: "icon", svg: require("../../icons/help.svg")})
        );
    };
    FormLabel.prototype.renderAdditionalText = function () {
        var _a = this.props, helpText = _a.helpText, errorText = _a.errorText;
        var helpVisible = this.state.helpVisible;
        if (!helpVisible && !errorText)
            return null;
        return React.createElement("div", {className: "additional-text"}, 
            errorText ? React.createElement("div", {className: "error-text"}, string_1.firstUp(errorText)) : null, 
            helpVisible ? React.createElement("div", {className: "help-text", dangerouslySetInnerHTML: { __html: helpText }}) : null);
    };
    FormLabel.prototype.render = function () {
        var _a = this.props, label = _a.label, errorText = _a.errorText, isBubble = _a.isBubble;
        return React.createElement("div", {className: dom_1.classNames('form-label', { error: !!errorText, bubble: isBubble })}, 
            React.createElement("div", {className: "label"}, label), 
            this.renderIcon(), 
            this.renderAdditionalText());
    };
    return FormLabel;
}(React.Component));
exports.FormLabel = FormLabel;
