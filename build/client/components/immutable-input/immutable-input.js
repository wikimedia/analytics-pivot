"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./immutable-input.css');
var React = require('react');
var ReactDOM = require('react-dom');
var index_1 = require('../../../common/utils/index');
var dom_1 = require('../../utils/dom/dom');
var ImmutableInput = (function (_super) {
    __extends(ImmutableInput, _super);
    function ImmutableInput() {
        _super.call(this);
        this.focusAlreadyGiven = false;
        this.state = {};
    }
    ImmutableInput.simpleGenerator = function (instance, changeFn) {
        return function (name, validator, focusOnStartUp) {
            if (validator === void 0) { validator = /^.+$/; }
            if (focusOnStartUp === void 0) { focusOnStartUp = false; }
            return React.createElement(ImmutableInput, {key: name, instance: instance, path: name, className: name, onChange: changeFn, focusOnStartUp: focusOnStartUp, validator: validator});
        };
    };
    ;
    ImmutableInput.prototype.initFromProps = function (props) {
        if (!props.instance || !props.path)
            return;
        var validString;
        if (this.state.validString === undefined) {
            validString = props.valueToString(index_1.ImmutableUtils.getProperty(props.instance, props.path));
        }
        else {
            var currentCanonical = props.valueToString(props.stringToValue(this.state.validString));
            var possibleCanonical = props.valueToString(index_1.ImmutableUtils.getProperty(props.instance, props.path));
            validString = currentCanonical === possibleCanonical ? this.state.validString : possibleCanonical;
        }
        this.setState({
            myInstance: props.instance,
            invalidString: undefined,
            validString: validString
        });
    };
    ImmutableInput.prototype.reset = function (callback) {
        this.setState({
            invalidString: undefined,
            validString: undefined
        }, callback);
    };
    ImmutableInput.prototype.componentWillReceiveProps = function (nextProps) {
        var _this = this;
        if (nextProps.instance === undefined) {
            this.reset(function () { return _this.initFromProps(nextProps); });
            return;
        }
        if (this.state.invalidString === undefined && nextProps.instance !== this.state.myInstance) {
            this.initFromProps(nextProps);
        }
    };
    ImmutableInput.prototype.componentDidUpdate = function () {
        this.maybeFocus();
    };
    ImmutableInput.prototype.componentDidMount = function () {
        this.initFromProps(this.props);
        this.maybeFocus();
    };
    ImmutableInput.prototype.maybeFocus = function () {
        if (!this.focusAlreadyGiven && this.props.focusOnStartUp && this.refs['me']) {
            ReactDOM.findDOMNode(this.refs['me']).focus();
            this.focusAlreadyGiven = true;
        }
    };
    ImmutableInput.prototype.isValueValid = function (value) {
        var validator = this.props.validator;
        if (!validator)
            return true;
        if (validator instanceof RegExp) {
            return validator.test(value);
        }
        if (validator instanceof Function) {
            return !!validator(value);
        }
        return true;
    };
    ImmutableInput.prototype.update = function (newString) {
        var _a = this.props, path = _a.path, onChange = _a.onChange, instance = _a.instance, validator = _a.validator, onInvalid = _a.onInvalid, stringToValue = _a.stringToValue;
        var myInstance;
        var invalidString;
        var validString;
        var error = '';
        try {
            var newValue = stringToValue ? stringToValue(newString) : newString;
            if (validator && !this.isValueValid(newString)) {
                myInstance = instance;
                invalidString = newString;
                if (onInvalid)
                    onInvalid(newValue);
            }
            else {
                myInstance = index_1.ImmutableUtils.setProperty(instance, path, newValue);
                validString = newString;
            }
        }
        catch (e) {
            myInstance = instance;
            invalidString = newString;
            error = e.message;
            if (onInvalid)
                onInvalid(newValue);
        }
        this.setState({ myInstance: myInstance, invalidString: invalidString, validString: validString }, function () {
            if (onChange)
                onChange(myInstance, invalidString === undefined, path, error);
        });
    };
    ImmutableInput.prototype.onChange = function (event) {
        this.update(event.target.value);
    };
    ImmutableInput.prototype.render = function () {
        var _a = this.props, path = _a.path, valueToString = _a.valueToString, type = _a.type, className = _a.className;
        var _b = this.state, myInstance = _b.myInstance, invalidString = _b.invalidString, validString = _b.validString;
        var isInvalid = invalidString !== undefined;
        if (!path || !myInstance)
            return null;
        if (type === 'textarea') {
            return React.createElement("textarea", {className: dom_1.classNames('immutable-input', className, { error: isInvalid }), ref: 'me', type: "text", value: (isInvalid ? invalidString : validString) || '', onChange: this.onChange.bind(this)});
        }
        return React.createElement("input", {className: dom_1.classNames('immutable-input', className, { error: isInvalid }), ref: 'me', type: "text", value: (isInvalid ? invalidString : validString) || '', onChange: this.onChange.bind(this)});
    };
    ImmutableInput.defaultProps = {
        type: 'text',
        stringToValue: String,
        valueToString: function (value) { return value ? String(value) : ''; }
    };
    return ImmutableInput;
}(React.Component));
exports.ImmutableInput = ImmutableInput;
