"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./home-view.css');
var React = require('react');
var index_1 = require('../../../common/models/index');
var constants_1 = require('../../config/constants');
var index_2 = require('../../modals/index');
var index_3 = require('../../components/index');
var home_header_bar_1 = require('./home-header-bar/home-header-bar');
var item_card_1 = require('./item-card/item-card');
var HomeView = (function (_super) {
    __extends(HomeView, _super);
    function HomeView() {
        _super.call(this);
        this.state = {};
    }
    HomeView.prototype.goToItem = function (item) {
        var fragments = item.name;
        if (index_1.Collection.isCollection(item)) {
            fragments = 'collection/' + fragments;
        }
        window.location.hash = '#' + fragments;
    };
    HomeView.prototype.goToSettings = function () {
        window.location.hash = '#settings';
    };
    HomeView.prototype.renderSettingsIcon = function () {
        var user = this.props.user;
        if (!user || !user.allow['settings'])
            return null;
        return React.createElement("div", {className: "icon-button", onClick: this.goToSettings.bind(this)}, 
            React.createElement(index_3.SvgIcon, {svg: require('../../icons/full-settings.svg')})
        );
    };
    HomeView.prototype.renderItem = function (item) {
        return React.createElement(item_card_1.ItemCard, {key: item.name, title: item.title, count: index_1.Collection.isCollection(item) ? item.tiles.length : undefined, description: item.description, icon: item instanceof index_1.DataCube ? 'full-cube' : 'full-collection', onClick: this.goToItem.bind(this, item)});
    };
    HomeView.prototype.renderItems = function (items, adder) {
        return React.createElement("div", {className: "items-container"}, 
            items.map(this.renderItem, this), 
            adder || React.createElement("div", {className: "item-card empty"}), 
            React.createElement("div", {className: "item-card empty"}), 
            React.createElement("div", {className: "item-card empty"}), 
            React.createElement("div", {className: "item-card empty"}));
    };
    HomeView.prototype.createCollection = function () {
        this.setState({
            showAddCollectionModal: true
        });
    };
    HomeView.prototype.renderAddCollectionModal = function () {
        var _this = this;
        var _a = this.props, collections = _a.collections, collectionsDelegate = _a.collectionsDelegate;
        var closeModal = function () {
            _this.setState({
                showAddCollectionModal: false
            });
        };
        var addCollection = function (collection) {
            closeModal();
            collectionsDelegate.addCollection(collection);
        };
        return React.createElement(index_2.AddCollectionModal, {collections: collections, onCancel: closeModal, onSave: addCollection});
    };
    HomeView.prototype.renderDataCubes = function () {
        var dataCubes = this.props.dataCubes;
        return React.createElement("div", {className: "datacubes"}, 
            React.createElement("div", {className: "section-title"}, constants_1.STRINGS.dataCubes), 
            this.renderItems(dataCubes));
    };
    HomeView.prototype.renderCollections = function () {
        var _a = this.props, collections = _a.collections, collectionsDelegate = _a.collectionsDelegate;
        if (!collectionsDelegate && collections.length === 0)
            return null;
        var create = this.createCollection.bind(this);
        return React.createElement("div", {className: "collections"}, 
            React.createElement("div", {className: "grid-row"}, 
                React.createElement("div", {className: "grid-col-90 section-title"}, constants_1.STRINGS.collections), 
                React.createElement("div", {className: "grid-col-10 right actions"}, collectionsDelegate && collections.length > 4 ?
                    React.createElement("div", {className: "add", onClick: create}, 
                        React.createElement(index_3.SvgIcon, {svg: require('../../icons/full-add-framed.svg')})
                    )
                    : null)), 
            this.renderItems(collections, collectionsDelegate ? item_card_1.ItemCard.getNewItemCard(create) : null));
    };
    HomeView.prototype.render = function () {
        var _a = this.props, user = _a.user, onNavClick = _a.onNavClick, onOpenAbout = _a.onOpenAbout, customization = _a.customization;
        var showAddCollectionModal = this.state.showAddCollectionModal;
        return React.createElement("div", {className: "home-view"}, 
            React.createElement(home_header_bar_1.HomeHeaderBar, {user: user, onNavClick: onNavClick, customization: customization, title: constants_1.STRINGS.home}, 
                React.createElement("button", {className: "text-button", onClick: onOpenAbout}, constants_1.STRINGS.infoAndFeedback), 
                this.renderSettingsIcon()), 
            React.createElement("div", {className: "container"}, 
                this.renderDataCubes(), 
                this.renderCollections()), 
            showAddCollectionModal ? this.renderAddCollectionModal() : null);
    };
    return HomeView;
}(React.Component));
exports.HomeView = HomeView;
