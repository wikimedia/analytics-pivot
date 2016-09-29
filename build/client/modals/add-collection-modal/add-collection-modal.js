"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./add-collection-modal.css');
var React = require('react');
var index_1 = require('../../../common/models/index');
var dom_1 = require('../../utils/dom/dom');
var immutable_form_delegate_1 = require('../../utils/immutable-form-delegate/immutable-form-delegate');
var string_1 = require('../../../common/utils/string/string');
var index_2 = require('../../components/index');
var constants_1 = require('../../config/constants');
var labels_1 = require('../../../common/models/labels');
var AddCollectionModal = (function (_super) {
    __extends(AddCollectionModal, _super);
    function AddCollectionModal() {
        _super.call(this);
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    AddCollectionModal.prototype.initFromProps = function (props) {
        this.setState({
            canSave: true,
            newInstance: new index_1.Collection({
                name: string_1.generateUniqueName('c', this.isNameUnique.bind(this)),
                tiles: [],
                title: 'New collection'
            })
        });
    };
    AddCollectionModal.prototype.componentDidMount = function () {
        this.initFromProps(this.props);
    };
    AddCollectionModal.prototype.save = function () {
        if (this.state.canSave)
            this.props.onSave(this.state.newInstance);
    };
    AddCollectionModal.prototype.isNameUnique = function (name) {
        var collections = this.props.collections;
        if (collections.filter(function (c) { return c.name === name; }).length > 0)
            return false;
        return true;
    };
    AddCollectionModal.prototype.render = function () {
        var _a = this.state, canSave = _a.canSave, errors = _a.errors, newInstance = _a.newInstance;
        var collections = this.props.collections;
        if (!newInstance)
            return null;
        var makeLabel = index_2.FormLabel.simpleGenerator(labels_1.COLLECTION, errors, true);
        var makeTextInput = index_2.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        return React.createElement(index_2.Modal, {className: "add-collection-modal", title: constants_1.STRINGS.addNewCollection, onClose: this.props.onCancel, onEnter: this.save.bind(this)}, 
            React.createElement("form", {className: "general vertical"}, 
                makeLabel('title'), 
                makeTextInput('title', /^.+$/, true), 
                makeLabel('description'), 
                makeTextInput('description')), 
            React.createElement("div", {className: "button-bar"}, 
                React.createElement(index_2.Button, {className: dom_1.classNames("save", { disabled: !canSave }), title: "Create", type: "primary", onClick: this.save.bind(this)}), 
                React.createElement(index_2.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: this.props.onCancel})));
    };
    return AddCollectionModal;
}(React.Component));
exports.AddCollectionModal = AddCollectionModal;
