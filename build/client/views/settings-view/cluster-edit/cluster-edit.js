"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./cluster-edit.css');
var React = require('react');
var dom_1 = require('../../../utils/dom/dom');
var string_1 = require('../../../../common/utils/string/string');
var constants_1 = require('../../../config/constants');
var form_label_1 = require('../../../components/form-label/form-label');
var button_1 = require('../../../components/button/button');
var immutable_input_1 = require('../../../components/immutable-input/immutable-input');
var immutable_dropdown_1 = require('../../../components/immutable-dropdown/immutable-dropdown');
var immutable_form_delegate_1 = require('../../../utils/immutable-form-delegate/immutable-form-delegate');
var index_1 = require('../../../../common/models/index');
var labels_1 = require('../../../../common/models/labels');
var ClusterEdit = (function (_super) {
    __extends(ClusterEdit, _super);
    function ClusterEdit() {
        _super.call(this);
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    ClusterEdit.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.cluster) {
            this.initFromProps(nextProps);
        }
    };
    ClusterEdit.prototype.initFromProps = function (props) {
        this.setState({
            newInstance: new index_1.Cluster(props.cluster.valueOf()),
            canSave: true,
            errors: {}
        });
    };
    ClusterEdit.prototype.componentDidMount = function () {
        if (this.props.cluster)
            this.initFromProps(this.props);
    };
    ClusterEdit.prototype.cancel = function () {
        var _this = this;
        var isNewCluster = this.props.isNewCluster;
        if (isNewCluster) {
            this.props.onCancel();
            return;
        }
        this.setState({ newInstance: undefined }, function () { return _this.initFromProps(_this.props); });
    };
    ClusterEdit.prototype.save = function () {
        if (this.props.onSave)
            this.props.onSave(this.state.newInstance);
    };
    ClusterEdit.prototype.goBack = function () {
        var cluster = this.props.cluster;
        var hash = window.location.hash;
        window.location.hash = hash.replace("/" + cluster.name, '');
    };
    ClusterEdit.prototype.renderGeneral = function () {
        var _a = this.state, newInstance = _a.newInstance, errors = _a.errors;
        var makeLabel = form_label_1.FormLabel.simpleGenerator(labels_1.CLUSTER, errors);
        var makeTextInput = immutable_input_1.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        var makeDropDownInput = immutable_dropdown_1.ImmutableDropdown.simpleGenerator(newInstance, this.delegate.onChange);
        var needsAuth = ['mysql', 'postgres'].indexOf(newInstance.type) > -1;
        return React.createElement("form", {className: "general vertical"}, 
            makeLabel('title'), 
            makeTextInput('title', /.*/, true), 
            makeLabel('host'), 
            makeTextInput('host', string_1.IP_REGEX), 
            makeLabel('type'), 
            makeDropDownInput('type', index_1.Cluster.TYPE_VALUES.map(function (type) { return { value: type, label: type }; })), 
            makeLabel('timeout'), 
            makeTextInput('timeout', string_1.NUM_REGEX), 
            makeLabel('version'), 
            makeTextInput('version'), 
            needsAuth ? makeLabel('database') : null, 
            needsAuth ? makeTextInput('database') : null, 
            needsAuth ? makeLabel('user') : null, 
            needsAuth ? makeTextInput('user') : null, 
            needsAuth ? makeLabel('password') : null, 
            needsAuth ? makeTextInput('password') : null);
    };
    ClusterEdit.prototype.renderButtons = function () {
        var _a = this.props, cluster = _a.cluster, isNewCluster = _a.isNewCluster;
        var _b = this.state, canSave = _b.canSave, newInstance = _b.newInstance;
        var hasChanged = !cluster.equals(newInstance);
        var cancelButton = React.createElement(button_1.Button, {className: "cancel", title: isNewCluster ? "Cancel" : "Revert changes", type: "secondary", onClick: this.cancel.bind(this)});
        var saveButton = React.createElement(button_1.Button, {className: dom_1.classNames("save", { disabled: !canSave || (!isNewCluster && !hasChanged) }), title: isNewCluster ? "Connect cluster" : "Save", type: "primary", onClick: this.save.bind(this)});
        if (!isNewCluster && !hasChanged) {
            return React.createElement("div", {className: "button-group"}, saveButton);
        }
        return React.createElement("div", {className: "button-group"}, 
            cancelButton, 
            saveButton);
    };
    ClusterEdit.prototype.getTitle = function () {
        var isNewCluster = this.props.isNewCluster;
        var newInstance = this.state.newInstance;
        var lastBit = newInstance.title ? ": " + newInstance.title : '';
        return (isNewCluster ? constants_1.STRINGS.createCluster : constants_1.STRINGS.editCluster) + lastBit;
    };
    ClusterEdit.prototype.render = function () {
        var isNewCluster = this.props.isNewCluster;
        var newInstance = this.state.newInstance;
        if (!newInstance)
            return null;
        return React.createElement("div", {className: "cluster-edit"}, 
            React.createElement("div", {className: "title-bar"}, 
                isNewCluster
                    ? null
                    : React.createElement(button_1.Button, {className: "button back", type: "secondary", svg: require('../../../icons/full-back.svg'), onClick: this.goBack.bind(this)}), 
                React.createElement("div", {className: "title"}, this.getTitle()), 
                this.renderButtons()), 
            React.createElement("div", {className: "content"}, this.renderGeneral()));
    };
    return ClusterEdit;
}(React.Component));
exports.ClusterEdit = ClusterEdit;
