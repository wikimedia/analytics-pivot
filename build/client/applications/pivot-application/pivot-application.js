"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./pivot-application.css');
var React = require('react');
var plywood_1 = require('plywood');
var url_1 = require('../../utils/url/url');
var index_1 = require('../../../common/models/index');
var function_slot_1 = require('../../utils/function-slot/function-slot');
var ajax_1 = require('../../utils/ajax/ajax');
var index_2 = require('../../modals/index');
var index_3 = require('../../components/index');
var no_data_view_1 = require('../../views/no-data-view/no-data-view');
var home_view_1 = require('../../views/home-view/home-view');
var link_view_1 = require('../../views/link-view/link-view');
var cube_view_1 = require('../../views/cube-view/cube-view');
var settings_view_1 = require('../../views/settings-view/settings-view');
var collection_view_1 = require('../../views/collection-view/collection-view');
var collection_view_delegate_1 = require('./collection-view-delegate/collection-view-delegate');
exports.HOME = "home";
exports.CUBE = "cube";
exports.COLLECTION = "collection";
exports.LINK = "link";
exports.SETTINGS = "settings";
exports.NO_DATA = "no-data";
var PivotApplication = (function (_super) {
    __extends(PivotApplication, _super);
    function PivotApplication() {
        _super.call(this);
        this.hashUpdating = false;
        this.collectionViewDelegate = new collection_view_delegate_1.CollectionViewDelegate(this);
        this.sideBarHrefFn = function_slot_1.createFunctionSlot();
        this.state = {
            appSettings: null,
            drawerOpen: false,
            selectedItem: null,
            viewType: null,
            viewHash: null,
            showAboutModal: false
        };
        this.globalHashChangeListener = this.globalHashChangeListener.bind(this);
    }
    PivotApplication.prototype.componentWillMount = function () {
        var _a = this.props, appSettings = _a.appSettings, initTimekeeper = _a.initTimekeeper;
        var dataCubes = appSettings.dataCubes, collections = appSettings.collections;
        var hash = window.location.hash;
        var viewType = this.getViewTypeFromHash(hash);
        if (viewType !== exports.SETTINGS && !dataCubes.length) {
            window.location.hash = '';
            this.setState({
                viewType: exports.NO_DATA,
                viewHash: '',
                appSettings: appSettings
            });
            return;
        }
        var viewHash = this.getViewHashFromHash(hash);
        var selectedItem;
        if (this.viewTypeNeedsAnItem(viewType)) {
            selectedItem = this.getSelectedItemFromHash(viewType === exports.CUBE ? dataCubes : collections, hash, viewType);
            if (!selectedItem) {
                this.changeHash('');
                viewType = exports.HOME;
            }
        }
        if (viewType === exports.HOME && dataCubes.length === 1 && collections.length === 0) {
            viewType = exports.CUBE;
            selectedItem = dataCubes[0];
        }
        this.setState({
            viewType: viewType,
            viewHash: viewHash,
            selectedItem: selectedItem,
            appSettings: appSettings,
            timekeeper: initTimekeeper || index_1.Timekeeper.EMPTY
        });
    };
    PivotApplication.prototype.viewTypeNeedsAnItem = function (viewType) {
        return [exports.CUBE, exports.COLLECTION].indexOf(viewType) > -1;
    };
    PivotApplication.prototype.componentDidMount = function () {
        var _this = this;
        window.addEventListener('hashchange', this.globalHashChangeListener);
        ajax_1.Ajax.settingsVersionGetter = function () {
            var appSettings = _this.state.appSettings;
            return appSettings.getVersion();
        };
        ajax_1.Ajax.onUpdate = function () {
            console.log('UPDATE!!');
        };
        require.ensure(['clipboard'], function (require) {
            var Clipboard = require('clipboard');
            var clipboard = new Clipboard('.clipboard');
            clipboard.on('success', function (e) {
            });
        }, 'clipboard');
        require.ensure(['react-addons-css-transition-group', '../../components/side-drawer/side-drawer'], function (require) {
            _this.setState({
                ReactCSSTransitionGroupAsync: require('react-addons-css-transition-group'),
                SideDrawerAsync: require('../../components/side-drawer/side-drawer').SideDrawer
            });
        }, 'side-drawer');
        require.ensure(['../../modals/about-modal/about-modal'], function (require) {
            _this.setState({
                AboutModalAsync: require('../../modals/about-modal/about-modal').AboutModal
            });
        }, 'about-modal');
        require.ensure(['../../components/notifications/notifications'], function (require) {
            var _a = require('../../components/notifications/notifications'), Notifications = _a.Notifications, Questions = _a.Questions;
            _this.setState({
                NotificationsAsync: Notifications,
                QuestionsAsync: Questions
            });
        }, 'notifications');
    };
    PivotApplication.prototype.componentWillUnmount = function () {
        window.removeEventListener('hashchange', this.globalHashChangeListener);
    };
    PivotApplication.prototype.globalHashChangeListener = function () {
        if (this.hashUpdating)
            return;
        this.hashToState(window.location.hash);
    };
    PivotApplication.prototype.hashToState = function (hash) {
        var _a = this.state.appSettings, dataCubes = _a.dataCubes, collections = _a.collections;
        var viewType = this.getViewTypeFromHash(hash);
        var viewHash = this.getViewHashFromHash(hash);
        var newState = {
            viewType: viewType,
            viewHash: viewHash,
            drawerOpen: false
        };
        if (this.viewTypeNeedsAnItem(viewType)) {
            var items = viewType === exports.CUBE ? dataCubes : collections;
            var item = this.getSelectedItemFromHash(items, hash, viewType);
            newState.selectedItem = item ? item : items[0];
        }
        else {
            newState.selectedItem = null;
        }
        this.setState(newState);
    };
    PivotApplication.prototype.parseHash = function (hash) {
        if (hash[0] === '#')
            hash = hash.substr(1);
        return hash.split('/');
    };
    PivotApplication.prototype.getViewTypeFromHash = function (hash) {
        var user = this.props.user;
        var appSettings = this.state.appSettings || this.props.appSettings;
        var dataCubes = appSettings.dataCubes;
        var viewType = this.parseHash(hash)[0];
        if (viewType === exports.SETTINGS && user && user.allow['settings'])
            return exports.SETTINGS;
        if (!dataCubes || !dataCubes.length)
            return exports.NO_DATA;
        if (!viewType || viewType === exports.HOME)
            return appSettings.linkViewConfig ? exports.LINK : exports.HOME;
        if (appSettings.linkViewConfig && viewType === exports.LINK)
            return exports.LINK;
        if (viewType === exports.COLLECTION)
            return exports.COLLECTION;
        if (viewType === exports.NO_DATA)
            return exports.NO_DATA;
        return exports.CUBE;
    };
    PivotApplication.prototype.getSelectedItemFromHash = function (items, hash, viewType) {
        var parts = this.parseHash(hash);
        var itemName = parts[viewType === exports.COLLECTION ? 1 : 0];
        return plywood_1.findByName(items, itemName);
    };
    PivotApplication.prototype.getViewHashFromHash = function (hash) {
        var parts = this.parseHash(hash);
        if (parts.length < 2)
            return null;
        parts.shift();
        return parts.join('/');
    };
    PivotApplication.prototype.sideDrawerOpen = function (drawerOpen) {
        this.setState({ drawerOpen: drawerOpen });
    };
    PivotApplication.prototype.changeHash = function (hash, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        this.hashUpdating = true;
        if (window.location.hash === "#" + hash.split('/')[0]) {
            url_1.replaceHash('#' + hash);
        }
        else {
            window.location.hash = "#" + hash;
        }
        setTimeout(function () {
            _this.hashUpdating = false;
        }, 5);
        if (force)
            this.hashToState(hash);
    };
    PivotApplication.prototype.updateViewHash = function (viewHash, force) {
        if (force === void 0) { force = false; }
        var viewType = this.state.viewType;
        var newHash;
        if (viewType === exports.CUBE) {
            newHash = this.state.selectedItem.name + "/" + viewHash;
        }
        else if (viewType === exports.COLLECTION) {
            newHash = "collection/" + this.state.selectedItem.name;
        }
        else if (viewType === exports.LINK) {
            newHash = viewType + "/" + viewHash;
        }
        else {
            newHash = viewType;
        }
        this.changeHash(newHash, force);
    };
    PivotApplication.prototype.getUrlPrefix = function (baseOnly) {
        if (baseOnly === void 0) { baseOnly = false; }
        var viewType = this.state.viewType;
        var url = window.location;
        var urlBase = url.origin + url.pathname;
        if (baseOnly)
            return urlBase;
        var newPrefix;
        if (this.viewTypeNeedsAnItem(viewType)) {
            newPrefix = this.state.selectedItem.name + "/";
        }
        else {
            newPrefix = viewType;
        }
        return urlBase + '#' + newPrefix;
    };
    PivotApplication.prototype.openAboutModal = function () {
        this.setState({
            showAboutModal: true
        });
    };
    PivotApplication.prototype.onAboutModalClose = function () {
        this.setState({
            showAboutModal: false
        });
    };
    PivotApplication.prototype.onSettingsChange = function (newSettings) {
        this.setState({
            appSettings: newSettings
        });
    };
    PivotApplication.prototype.addEssenceToCollection = function (essence) {
        this.setState({
            essenceToAddToACollection: essence,
            showAddCollectionModal: true
        });
    };
    PivotApplication.prototype.renderAddCollectionModal = function () {
        var _this = this;
        var _a = this.state, appSettings = _a.appSettings, selectedItem = _a.selectedItem, timekeeper = _a.timekeeper, showAddCollectionModal = _a.showAddCollectionModal, essenceToAddToACollection = _a.essenceToAddToACollection;
        if (!showAddCollectionModal)
            return null;
        if (!index_1.DataCube.isDataCube(selectedItem)) {
            throw new Error("Can't call this method without a valid dataCube. It's\n        probably called from the wrong view.");
        }
        var closeModal = function () {
            _this.setState({
                showAddCollectionModal: false
            });
        };
        var onSave = function (_collection, CollectionTile) {
            closeModal();
            _this.collectionViewDelegate.addTile(_collection, CollectionTile).then(function (url) {
                index_3.Notifier.success('Item added', {
                    label: 'View',
                    callback: function () { return window.location.hash = "#collection/" + _collection.name; }
                });
            });
        };
        return React.createElement(index_2.AddCollectionTileModal, {collections: appSettings.collections, essence: essenceToAddToACollection, timekeeper: timekeeper, dataCube: selectedItem, onSave: onSave, onCancel: closeModal});
    };
    PivotApplication.prototype.renderAboutModal = function () {
        var version = this.props.version;
        var _a = this.state, AboutModalAsync = _a.AboutModalAsync, showAboutModal = _a.showAboutModal;
        if (!AboutModalAsync || !showAboutModal)
            return null;
        return React.createElement(AboutModalAsync, {version: version, onClose: this.onAboutModalClose.bind(this)});
    };
    PivotApplication.prototype.renderNotifications = function () {
        var NotificationsAsync = this.state.NotificationsAsync;
        if (!NotificationsAsync)
            return null;
        return React.createElement(NotificationsAsync, null);
    };
    PivotApplication.prototype.renderQuestions = function () {
        var QuestionsAsync = this.state.QuestionsAsync;
        if (!QuestionsAsync)
            return null;
        return React.createElement(QuestionsAsync, null);
    };
    PivotApplication.prototype.renderSideDrawer = function () {
        var user = this.props.user;
        var _a = this.state, viewType = _a.viewType, selectedItem = _a.selectedItem, drawerOpen = _a.drawerOpen, SideDrawerAsync = _a.SideDrawerAsync, appSettings = _a.appSettings;
        if (!drawerOpen || !SideDrawerAsync)
            return null;
        var dataCubes = appSettings.dataCubes, collections = appSettings.collections, customization = appSettings.customization;
        var closeSideDrawer = this.sideDrawerOpen.bind(this, false);
        return React.createElement(SideDrawerAsync, {key: 'drawer', selectedItem: selectedItem, collections: collections, dataCubes: dataCubes, onOpenAbout: this.openAboutModal.bind(this), onClose: closeSideDrawer, customization: customization, user: user, itemHrefFn: this.sideBarHrefFn, viewType: viewType});
    };
    PivotApplication.prototype.renderSideDrawerTransition = function () {
        var ReactCSSTransitionGroupAsync = this.state.ReactCSSTransitionGroupAsync;
        if (!ReactCSSTransitionGroupAsync)
            return null;
        return React.createElement(ReactCSSTransitionGroupAsync, {component: "div", className: "side-drawer-container", transitionName: "side-drawer", transitionEnterTimeout: 500, transitionLeaveTimeout: 300}, this.renderSideDrawer());
    };
    PivotApplication.prototype.renderView = function () {
        var _a = this.props, maxFilters = _a.maxFilters, maxSplits = _a.maxSplits, user = _a.user, stateful = _a.stateful;
        var _b = this.state, viewType = _b.viewType, viewHash = _b.viewHash, selectedItem = _b.selectedItem, appSettings = _b.appSettings, timekeeper = _b.timekeeper, cubeViewSupervisor = _b.cubeViewSupervisor;
        var dataCubes = appSettings.dataCubes, collections = appSettings.collections, customization = appSettings.customization, linkViewConfig = appSettings.linkViewConfig;
        switch (viewType) {
            case exports.NO_DATA:
                return React.createElement(no_data_view_1.NoDataView, {user: user, onNavClick: this.sideDrawerOpen.bind(this, true), onOpenAbout: this.openAboutModal.bind(this), customization: customization, appSettings: appSettings, stateful: stateful});
            case exports.HOME:
                return React.createElement(home_view_1.HomeView, {user: user, dataCubes: dataCubes, collections: collections, onNavClick: this.sideDrawerOpen.bind(this, true), onOpenAbout: this.openAboutModal.bind(this), customization: customization, collectionsDelegate: stateful ? this.collectionViewDelegate : null});
            case exports.CUBE:
                return React.createElement(cube_view_1.CubeView, {user: user, dataCube: selectedItem, initTimekeeper: timekeeper, hash: viewHash, updateViewHash: this.updateViewHash.bind(this), getUrlPrefix: this.getUrlPrefix.bind(this), maxFilters: maxFilters, maxSplits: maxSplits, onNavClick: this.sideDrawerOpen.bind(this, true), customization: customization, transitionFnSlot: this.sideBarHrefFn, supervisor: cubeViewSupervisor, addEssenceToCollection: this.addEssenceToCollection.bind(this), stateful: stateful});
            case exports.COLLECTION:
                return React.createElement(collection_view_1.CollectionView, {user: user, collections: collections, timekeeper: timekeeper, dataCubes: dataCubes, onNavClick: this.sideDrawerOpen.bind(this, true), customization: customization, delegate: stateful ? this.collectionViewDelegate : null});
            case exports.LINK:
                return React.createElement(link_view_1.LinkView, {user: user, collection: linkViewConfig, timekeeper: timekeeper, hash: viewHash, updateViewHash: this.updateViewHash.bind(this), changeHash: this.changeHash.bind(this), getUrlPrefix: this.getUrlPrefix.bind(this), onNavClick: this.sideDrawerOpen.bind(this, true), customization: customization, stateful: stateful});
            case exports.SETTINGS:
                return React.createElement(settings_view_1.SettingsView, {user: user, onNavClick: this.sideDrawerOpen.bind(this, true), onSettingsChange: this.onSettingsChange.bind(this), customization: customization});
            default:
                throw new Error('unknown view');
        }
    };
    PivotApplication.prototype.render = function () {
        return React.createElement("main", {className: 'pivot-application'}, 
            this.renderView(), 
            this.renderSideDrawerTransition(), 
            this.renderAboutModal(), 
            this.renderAddCollectionModal(), 
            this.renderNotifications(), 
            this.renderQuestions());
    };
    return PivotApplication;
}(React.Component));
exports.PivotApplication = PivotApplication;
