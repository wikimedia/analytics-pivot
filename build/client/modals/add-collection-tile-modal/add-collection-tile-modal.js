"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./add-collection-tile-modal.css');
var React = require('react');
var index_1 = require('../../../common/models/index');
var dom_1 = require('../../utils/dom/dom');
var string_1 = require('../../../common/utils/string/string');
var index_2 = require('../../components/index');
var constants_1 = require('../../config/constants');
var labels_1 = require('../../../common/models/labels');
var immutable_form_delegate_1 = require('../../utils/immutable-form-delegate/immutable-form-delegate');
var AddCollectionTileModal = (function (_super) {
    __extends(AddCollectionTileModal, _super);
    function AddCollectionTileModal() {
        _super.call(this);
        this.delegate = new immutable_form_delegate_1.ImmutableFormDelegate(this);
    }
    AddCollectionTileModal.prototype.getTitleFromEssence = function (essence) {
        var splits = essence.splits;
        if (splits.length() === 0)
            return essence.selectedMeasures.map(function (m) {
                return essence.dataCube.getMeasure(m).title;
            }).join(', ');
        var dimensions = [];
        var measures = [];
        splits.forEach(function (split) {
            var dimension = split.getDimension(essence.dataCube.dimensions);
            var sortOn = index_1.SortOn.fromSortAction(split.sortAction, essence.dataCube, dimension);
            dimensions.push(dimension.title);
            measures.push(index_1.SortOn.getTitle(sortOn));
        });
        return dimensions.join(', ') + " by " + measures.join(', ');
    };
    AddCollectionTileModal.prototype.initFromProps = function (props) {
        var collection = props.collection, collections = props.collections, essence = props.essence, dataCube = props.dataCube;
        var collectionMode = 'none';
        var selectedCollection;
        if (collections) {
            collectionMode = collections.length > 0 ? 'picking' : 'adding';
            selectedCollection = collections.length > 0 ? collections[0] : new index_1.Collection({
                name: string_1.generateUniqueName('c', function () { return true; }),
                tiles: [],
                title: 'New collection'
            });
        }
        else {
            selectedCollection = collection;
        }
        this.setState({
            canSave: !!selectedCollection,
            collection: selectedCollection,
            collectionMode: collectionMode,
            newInstance: new index_1.CollectionTile({
                name: string_1.generateUniqueName('i', this.isItemNameUnique.bind(this, selectedCollection)),
                title: this.getTitleFromEssence(essence),
                description: '',
                essence: essence,
                group: null,
                dataCube: dataCube
            })
        });
    };
    AddCollectionTileModal.prototype.componentDidMount = function () {
        this.initFromProps(this.props);
    };
    AddCollectionTileModal.prototype.componentWillReceiveProps = function (nextProps) {
        if (!this.state.newInstance)
            this.initFromProps(nextProps);
    };
    AddCollectionTileModal.prototype.save = function () {
        var _a = this.state, canSave = _a.canSave, collection = _a.collection, newInstance = _a.newInstance;
        if (canSave && this.props.onSave)
            this.props.onSave(collection, newInstance);
    };
    AddCollectionTileModal.prototype.isItemNameUnique = function (collection, name) {
        if (!collection)
            return true;
        if (collection.tiles.filter(function (tile) { return tile.name === name; }).length > 0) {
            return false;
        }
        return true;
    };
    AddCollectionTileModal.prototype.renderCollectionDropdown = function () {
        var _this = this;
        var _a = this.state, collection = _a.collection, newInstance = _a.newInstance;
        var collections = this.props.collections;
        if (!collections || collections.length === 0)
            return null;
        var MyDropDown = index_2.Dropdown.specialize();
        var setCollection = function (c) {
            _this.setState({
                collection: c,
                newInstance: newInstance.change('name', string_1.generateUniqueName('i', c.isNameAvailable))
            });
        };
        return React.createElement(MyDropDown, {label: "Collection", items: collections, selectedItem: collection, renderItem: function (c) { return c ? (c.title || '<no title>') : 'Pick a collection'; }, keyItem: function (c) { return c.name; }, onSelect: setCollection});
    };
    AddCollectionTileModal.prototype.renderCollectionPicker = function () {
        var _this = this;
        var collections = this.props.collections;
        var _a = this.state, newInstance = _a.newInstance, collection = _a.collection, collectionMode = _a.collectionMode;
        var isCollectionNameUnique = function (name) {
            return collections.filter(function (c) { return c.name === name; }).length === 0;
        };
        var toggleCollectionMode = function () {
            var newMode = collectionMode === 'picking' ? 'adding' : 'picking';
            var collection = undefined;
            if (newMode === 'adding') {
                collection = new index_1.Collection({
                    name: string_1.generateUniqueName('c', isCollectionNameUnique),
                    tiles: [],
                    title: 'New collection'
                });
            }
            else {
                collection = collections[0];
            }
            _this.setState({
                collectionMode: newMode,
                collection: collection
            });
        };
        var onCollectionChange = function (newCollection) {
            _this.setState({
                collection: newCollection,
                newInstance: newInstance.change('name', string_1.generateUniqueName('i', _this.isItemNameUnique.bind(_this, newCollection)))
            });
        };
        if (collectionMode === 'none')
            return null;
        if (collectionMode === 'picking') {
            return React.createElement("div", {className: "collection-picker"}, 
                this.renderCollectionDropdown(), 
                React.createElement("div", {className: "new-collection", onClick: toggleCollectionMode}, "Or add a new collection"));
        }
        else {
            return React.createElement("div", {className: "collection-picker"}, 
                index_2.FormLabel.dumbLabel("Collection title"), 
                React.createElement(index_2.ImmutableInput, {className: "actionable", instance: collection, path: "title", onChange: onCollectionChange, focusOnStartUp: true}), 
                collections.length > 0 ?
                    React.createElement("div", {className: "new-collection", onClick: toggleCollectionMode}, "Or pick an existing collection")
                    : React.createElement("div", {className: "new-collection disabled"}, "This will be a new collection"));
        }
    };
    AddCollectionTileModal.prototype.toggleConvertToFixed = function () {
        var _a = this.props, essence = _a.essence, timekeeper = _a.timekeeper;
        var newInstance = this.state.newInstance;
        var convertToFixedTime = !this.state.convertToFixedTime;
        if (convertToFixedTime && essence.filter.isRelative()) {
            newInstance = newInstance.changeEssence(essence.convertToSpecificFilter(timekeeper));
        }
        else {
            newInstance = newInstance.changeEssence(essence);
        }
        this.setState({
            convertToFixedTime: convertToFixedTime,
            newInstance: newInstance
        });
    };
    AddCollectionTileModal.prototype.render = function () {
        var _a = this.state, canSave = _a.canSave, errors = _a.errors, newInstance = _a.newInstance, collectionMode = _a.collectionMode, convertToFixedTime = _a.convertToFixedTime;
        var _b = this.props, collections = _b.collections, onCancel = _b.onCancel, essence = _b.essence;
        if (!newInstance)
            return null;
        var makeLabel = index_2.FormLabel.simpleGenerator(labels_1.COLLECTION_ITEM, errors, true);
        var makeTextInput = index_2.ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
        var isRelative = essence.filter.isRelative();
        return React.createElement(index_2.Modal, {className: "add-collection-tile-modal", title: constants_1.STRINGS.addNewTile, onClose: onCancel, onEnter: this.save.bind(this)}, 
            React.createElement("form", {className: "general vertical"}, 
                this.renderCollectionPicker(), 
                makeLabel('title'), 
                makeTextInput('title', /^.+$/, collectionMode !== 'adding'), 
                makeLabel('description'), 
                makeTextInput('description', /^.*$/), 
                isRelative ?
                    React.createElement(index_2.Checkbox, {selected: convertToFixedTime, onClick: this.toggleConvertToFixed.bind(this), label: constants_1.STRINGS.convertToFixedTime})
                    : null), 
            React.createElement("div", {className: "button-bar"}, 
                React.createElement(index_2.Button, {className: dom_1.classNames("save", { disabled: !canSave }), title: "Add to collection", type: "primary", onClick: this.save.bind(this)}), 
                React.createElement(index_2.Button, {className: "cancel", title: "Cancel", type: "secondary", onClick: onCancel})));
    };
    return AddCollectionTileModal;
}(React.Component));
exports.AddCollectionTileModal = AddCollectionTileModal;
