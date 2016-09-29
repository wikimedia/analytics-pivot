"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./cluster-seed-modal.css');
var React = require('react');
var cluster_1 = require("../../../common/models/cluster/cluster");
var index_1 = require('../../components/index');
var constants_1 = require("../../config/constants");
var labels_1 = require('../../../common/models/labels');
var string_1 = require('../../../common/utils/string/string');
var array_1 = require('../../../common/utils/array/array');
var immutable_form_delegate_1 = require('../../utils/immutable-form-delegate/immutable-form-delegate');
var ClusterSeedModal = (function (_super) {
    __extends(ClusterSeedModal, _super);
    function ClusterSeedModal() {
        _super.call(this);
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    ClusterSeedModal.prototype.initFromProps = function (props) {
        var clusters = props.clusters;
        if (!clusters)
            return;
        this.setState({
            newInstance: new cluster_1.Cluster({
                name: string_1.generateUniqueName('cl', function (name) { return array_1.indexByAttribute(clusters, 'name', name) === -1; }),
                type: 'druid'
            })
        });
    };
    ClusterSeedModal.prototype.componentWillreceiveProps = function (nextProps) {
        this.initFromProps(nextProps);
    };
    ClusterSeedModal.prototype.componentDidMount = function () {
        this.initFromProps(this.props);
    };
    ClusterSeedModal.prototype.onNext = function () {
        this.props.onNext(this.state.newInstance);
    };
    ClusterSeedModal.prototype.render = function () {
        var _a = this.props, onNext = _a.onNext, onCancel = _a.onCancel;
        var _b = this.state, newInstance = _b.newInstance, errors = _b.errors;
        if (!newInstance)
            return null;
        var makeLabel = index_1.FormLabel.simpleGenerator(labels_1.CLUSTER, errors, true);
        var makeTextInput = index_1.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        var makeDropDownInput = index_1.ImmutableDropdown.simpleGenerator(newInstance, this.delegate.onChange);
        return React.createElement(index_1.Modal, {className: "cluster-seed-modal", title: constants_1.STRINGS.connectNewCluster, onClose: this.props.onCancel}, 
            React.createElement("form", null, 
                makeLabel('type'), 
                makeDropDownInput('type', cluster_1.Cluster.TYPE_VALUES.map(function (type) { return { value: type, label: type }; })), 
                makeLabel('host'), 
                makeTextInput('host', /^.+$/)), 
            React.createElement("div", {className: "button-bar"}, 
                React.createElement(index_1.Button, {type: "primary", title: constants_1.STRINGS.next + ": " + constants_1.STRINGS.configureCluster, onClick: this.onNext.bind(this)}), 
                React.createElement(index_1.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: onCancel})));
    };
    return ClusterSeedModal;
}(React.Component));
exports.ClusterSeedModal = ClusterSeedModal;
