"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./router.css');
var React = require('react');
var url_1 = require('../../utils/url/url');
var object_1 = require('../../../common/utils/object/object');
var Route = (function (_super) {
    __extends(Route, _super);
    function Route() {
        _super.apply(this, arguments);
    }
    return Route;
}(React.Component));
exports.Route = Route;
var HASH_SEPARATOR = /\/+/;
var Router = (function (_super) {
    __extends(Router, _super);
    function Router() {
        _super.call(this);
        this.state = {};
        this.globalHashChangeListener = this.globalHashChangeListener.bind(this);
    }
    Router.prototype.componentDidMount = function () {
        var _this = this;
        window.addEventListener('hashchange', this.globalHashChangeListener);
        window.setTimeout(function () { return _this.onHashChange(window.location.hash); }, 1);
    };
    Router.prototype.componentWillUnmount = function () {
        window.removeEventListener('hashchange', this.globalHashChangeListener);
    };
    Router.prototype.globalHashChangeListener = function () {
        var newHash = window.location.hash;
        if (this.removeRootFragmentFromHash(newHash) === newHash)
            return;
        if (this.state.hash !== newHash)
            this.onHashChange(newHash);
    };
    Router.prototype.removeRootFragmentFromHash = function (hash) {
        var rootFragment = this.props.rootFragment;
        if (!rootFragment)
            return hash;
        return hash.replace(new RegExp('^#' + rootFragment, 'gi'), '');
    };
    Router.prototype.componentWillReceiveProps = function (nextProps) {
        this.globalHashChangeListener();
    };
    Router.prototype.parseHash = function (hash) {
        if (!hash)
            return [];
        var fragments = this.removeRootFragmentFromHash(hash).split(HASH_SEPARATOR);
        return fragments.filter(Boolean);
    };
    Router.prototype.sanitizeHash = function (hash) {
        var rootFragment = this.props.rootFragment;
        var fragments = this.parseHash(hash);
        if (fragments.length === 0)
            return '#' + rootFragment;
        return "#" + rootFragment + "/" + fragments.join('/');
    };
    Router.prototype.replaceHash = function (newHash) {
        url_1.replaceHash(newHash);
        this.onHashChange(newHash);
    };
    Router.prototype.hasExtraFragments = function (path) {
        return path.crumbs.length > path.fragment.split(HASH_SEPARATOR).length;
    };
    Router.prototype.stripUnnecessaryFragments = function (path, crumbs) {
        var rootFragment = this.props.rootFragment;
        var fragments = path.fragment.split(HASH_SEPARATOR);
        var parentFragment = crumbs.join('/').replace(path.crumbs.join('/'), '').replace(/\/$/, '');
        var strippedRouteCrumbs = path.crumbs.slice(0, path.fragment.split(HASH_SEPARATOR).length);
        var strippedCrumbs = [
            rootFragment,
            parentFragment,
            strippedRouteCrumbs.join('/')
        ].filter(Boolean);
        this.replaceHash('#' + strippedCrumbs.join('/'));
    };
    Router.prototype.onHashChange = function (hash) {
        var rootFragment = this.props.rootFragment;
        var safeHash = this.sanitizeHash(hash);
        if (hash !== safeHash) {
            this.replaceHash(safeHash);
            return;
        }
        var crumbs = this.parseHash(hash);
        var children = this.props.children;
        if (crumbs.length === 0) {
            var defaultFragment = this.getDefaultFragment(children);
            if (defaultFragment) {
                this.replaceHash(hash + '/' + defaultFragment);
                return;
            }
        }
        var path = this.getQualifiedPath(children, crumbs);
        if (path.wasDefaultChoice) {
            crumbs.pop();
            crumbs.push(path.fragment);
            this.replaceHash('#' + [rootFragment].concat(crumbs).join('/'));
            return;
        }
        if (this.hasExtraFragments(path)) {
            this.stripUnnecessaryFragments(path, crumbs);
            return;
        }
        if (this.canDefaultDeeper(path.fragment, path.crumbs)) {
            crumbs = crumbs.concat(this.getDefaultDeeperCrumbs(path.fragment, path.crumbs));
            this.replaceHash('#' + [rootFragment].concat(crumbs).join('/'));
        }
        if (this.props.onURLChange) {
            this.props.onURLChange(crumbs);
        }
        this.setState({ hash: window.location.hash });
    };
    Router.prototype.getDefaultDeeperCrumbs = function (fragment, crumbs) {
        var bits = fragment.split(HASH_SEPARATOR);
        bits.splice(0, crumbs.length);
        return bits.map(function (bit) { return bit.match(/^:[^=]+=(\w+)$/)[1]; });
    };
    Router.prototype.canDefaultDeeper = function (fragment, crumbs) {
        var bits = fragment.split(HASH_SEPARATOR);
        if (bits.length === crumbs.length)
            return false;
        bits.splice(0, crumbs.length);
        return bits.every(function (bit) { return /^:[^=]+=\w+$/.test(bit); });
    };
    Router.prototype.getDefaultFragment = function (children) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.type === Route) {
                return child.props.fragment;
            }
        }
        return undefined;
    };
    Router.prototype.getQualifiedPath = function (candidates, crumbs, properties, orphans, parentRoutes) {
        if (properties === void 0) { properties = {}; }
        if (orphans === void 0) { orphans = []; }
        if (parentRoutes === void 0) { parentRoutes = []; }
        if (this.isRoute(candidates)) {
            candidates = ([candidates]);
        }
        for (var i = 0; i < candidates.length; i++) {
            var candidate = candidates[i];
            if (this.isAComment(candidate))
                continue;
            var fragment_1 = candidate.props.fragment;
            if (!fragment_1)
                continue;
            properties = object_1.extend(this.getPropertiesFromCrumbs(crumbs, fragment_1), properties);
            if (crumbs[0] === fragment_1 || fragment_1.charAt(0) === ':') {
                var children = candidate.props.children;
                var parents = parentRoutes.concat([candidate]);
                if (!(Array.isArray(children)) || crumbs.length === 1) {
                    return { fragment: fragment_1, route: candidate, crumbs: crumbs, properties: properties, orphans: orphans, parentRoutes: parents };
                }
                else {
                    if (candidate.props.alwaysShowOrphans === true) {
                        orphans = orphans.concat(children.filter(this.isSimpleChild, this));
                    }
                    return this.getQualifiedPath(children, crumbs.slice(1), properties, orphans, parents);
                }
            }
        }
        var route = candidates.filter(this.isRoute)[0];
        var fragment = route.props.fragment;
        properties = object_1.extend(this.getPropertiesFromCrumbs(crumbs, fragment), properties);
        return { fragment: fragment, route: route, crumbs: crumbs, wasDefaultChoice: true, properties: properties, orphans: orphans, parentRoutes: parentRoutes };
    };
    Router.prototype.hasSingleChild = function (route) {
        if (!route)
            return false;
        return !(Array.isArray(route.props.children));
    };
    Router.prototype.isRoute = function (candidate) {
        if (!candidate)
            return false;
        return candidate.type === Route;
    };
    Router.prototype.isAComment = function (candidate) {
        if (!candidate)
            return false;
        return candidate.type === undefined;
    };
    Router.prototype.isSimpleChild = function (candidate) {
        if (!candidate)
            return false;
        return !this.isAComment(candidate) && !this.isRoute(candidate);
    };
    Router.prototype.getSimpleChildren = function (parent) {
        if (!parent)
            return null;
        return parent.props.children.filter(this.isSimpleChild, this);
    };
    Router.prototype.getPropertiesFromCrumbs = function (crumbs, fragment, props) {
        if (props === void 0) { props = {}; }
        var fragmentToKey = function (f) { return f.slice(1).replace(/=.*$/, ''); };
        var myCrumbs = crumbs.concat();
        fragment.split(HASH_SEPARATOR).forEach(function (bit, i) {
            if (bit.charAt(0) !== ':')
                return;
            props[fragmentToKey(bit)] = myCrumbs.shift();
        });
        return props;
    };
    Router.prototype.inflate = function (pump, properties) {
        if (!pump)
            return properties;
        var newProperties = {};
        for (var originalKey in properties) {
            var _a = pump(originalKey, properties[originalKey]), key = _a.key, value = _a.value;
            newProperties[key] = value;
        }
        return newProperties;
    };
    Router.prototype.fillProperties = function (child, path, i) {
        if (i === void 0) { i = 0; }
        if (!(child.type instanceof Function))
            return child;
        var propsToTransmit = this.getPropertiesFromCrumbs(path.crumbs, path.route.props.fragment);
        path.parentRoutes.forEach(function (route) {
            if (route.props.transmit) {
                route.props.transmit.forEach(function (key) { return propsToTransmit[key] = path.properties[key]; });
            }
        });
        propsToTransmit = this.inflate(path.route.props.inflate, propsToTransmit);
        return React.cloneElement(child, object_1.extend(propsToTransmit, { key: i }));
    };
    Router.prototype.getQualifiedChild = function (candidates, crumbs) {
        var _this = this;
        var elements;
        var path = this.getQualifiedPath(candidates, crumbs);
        if (this.hasSingleChild(path.route)) {
            elements = path.orphans.map(function (orphan, i) { return _this.fillProperties(orphan, path, i); })
                .concat([this.fillProperties(path.route.props.children, path, path.orphans.length)]);
        }
        else {
            var children = this.getSimpleChildren(path.route);
            if (children.length === 0)
                return null;
            elements = children
                .map(function (child, i) { return _this.fillProperties(child, path, i); })
                .concat(path.orphans.map(function (orphan, i) { return _this.fillProperties(orphan, path, children.length + i); }));
        }
        if (!elements)
            return null;
        if (elements.length === 1)
            return elements[0];
        return elements;
    };
    Router.prototype.render = function () {
        var children = this.props.children;
        var hash = this.state.hash;
        if (hash === undefined)
            return null;
        var crumbs = this.parseHash(hash);
        if (!crumbs || !crumbs.length)
            return null;
        var qualifiedChildren = this.getQualifiedChild(children, crumbs);
        return React.createElement("div", {className: "route-wrapper", style: { width: '100%', height: '100%' }}, qualifiedChildren);
    };
    return Router;
}(React.Component));
exports.Router = Router;
