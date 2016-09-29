"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./preview-string-filter-menu.css');
var React = require("react");
var plywood_1 = require("plywood");
var general_1 = require("../../../common/utils/general/general");
var constants_1 = require("../../config/constants");
var index_1 = require("../../../common/models/index");
var dom_1 = require("../../utils/dom/dom");
var loader_1 = require("../loader/loader");
var query_error_1 = require("../query-error/query-error");
var highlight_string_1 = require("../highlight-string/highlight-string");
var button_1 = require("../button/button");
var global_event_listener_1 = require("../global-event-listener/global-event-listener");
var TOP_N = 100;
var PreviewStringFilterMenu = (function (_super) {
    __extends(PreviewStringFilterMenu, _super);
    function PreviewStringFilterMenu() {
        var _this = this;
        _super.call(this);
        this.state = {
            loading: false,
            dataset: null,
            queryError: null,
            fetchQueued: false,
            regexErrorMessage: ""
        };
        this.collectTriggerSearch = general_1.collect(constants_1.SEARCH_WAIT, function () {
            if (!_this.mounted)
                return;
            var _a = _this.props, essence = _a.essence, timekeeper = _a.timekeeper, dimension = _a.dimension, searchText = _a.searchText;
            _this.fetchData(essence, timekeeper, dimension, searchText);
        });
    }
    PreviewStringFilterMenu.prototype.fetchData = function (essence, timekeeper, dimension, searchText) {
        var _this = this;
        var dataCube = essence.dataCube;
        var nativeCount = dataCube.getMeasure('count');
        var measureExpression = nativeCount ? nativeCount.expression : plywood_1.$('main').count();
        var filterExpression = essence.getEffectiveFilter(timekeeper, null, dimension).toExpression();
        var query = plywood_1.$('main')
            .filter(filterExpression)
            .split(dimension.expression, dimension.name)
            .apply('MEASURE', measureExpression)
            .sort(plywood_1.$('MEASURE'), plywood_1.SortAction.DESCENDING)
            .limit(TOP_N + 1);
        this.setState({
            loading: true,
            fetchQueued: false
        });
        dataCube.executor(query, { timezone: essence.timezone })
            .then(function (dataset) {
            if (!_this.mounted)
                return;
            _this.setState({
                loading: false,
                dataset: dataset,
                queryError: null
            });
        }, function (error) {
            if (!_this.mounted)
                return;
            _this.setState({
                loading: false,
                dataset: null,
                queryError: error
            });
        });
    };
    PreviewStringFilterMenu.prototype.componentWillMount = function () {
        var _a = this.props, essence = _a.essence, timekeeper = _a.timekeeper, dimension = _a.dimension, searchText = _a.searchText, filterMode = _a.filterMode;
        if (searchText && filterMode === index_1.Filter.REGEX && !this.checkRegex(searchText))
            return;
        this.fetchData(essence, timekeeper, dimension, searchText);
    };
    PreviewStringFilterMenu.prototype.componentDidMount = function () {
        this.mounted = true;
    };
    PreviewStringFilterMenu.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    PreviewStringFilterMenu.prototype.componentWillReceiveProps = function (nextProps) {
        var _a = this.props, searchText = _a.searchText, filterMode = _a.filterMode;
        var incomingSearchText = nextProps.searchText;
        var _b = this.state, fetchQueued = _b.fetchQueued, loading = _b.loading, dataset = _b.dataset;
        if (incomingSearchText && filterMode === index_1.Filter.REGEX)
            this.checkRegex(incomingSearchText);
        if (incomingSearchText && incomingSearchText.indexOf(searchText) !== -1 && !fetchQueued && !loading && dataset && dataset.data.length < TOP_N) {
            return;
        }
        else {
            this.setState({
                fetchQueued: true
            });
            this.collectTriggerSearch();
        }
    };
    PreviewStringFilterMenu.prototype.checkRegex = function (text) {
        try {
            new RegExp(text);
            this.setState({ regexErrorMessage: null });
        }
        catch (e) {
            this.setState({ regexErrorMessage: e.message });
            return false;
        }
        return true;
    };
    PreviewStringFilterMenu.prototype.globalKeyDownListener = function (e) {
        if (dom_1.enterKey(e)) {
            this.onOkClick();
        }
    };
    PreviewStringFilterMenu.prototype.constructFilter = function () {
        var _a = this.props, dimension = _a.dimension, filterMode = _a.filterMode, onClauseChange = _a.onClauseChange, searchText = _a.searchText;
        var expression = dimension.expression;
        var clause = null;
        if (searchText) {
            if (filterMode === index_1.Filter.REGEX) {
                clause = new index_1.FilterClause({
                    expression: expression,
                    selection: searchText,
                    action: 'match'
                });
            }
            else if (filterMode === index_1.Filter.CONTAINS) {
                clause = new index_1.FilterClause({
                    expression: expression,
                    selection: plywood_1.r(searchText),
                    action: 'contains'
                });
            }
        }
        return onClauseChange(clause);
    };
    PreviewStringFilterMenu.prototype.onOkClick = function () {
        if (!this.actionEnabled())
            return;
        var _a = this.props, clicker = _a.clicker, onClose = _a.onClose;
        clicker.changeFilter(this.constructFilter());
        onClose();
    };
    PreviewStringFilterMenu.prototype.onCancelClick = function () {
        var onClose = this.props.onClose;
        onClose();
    };
    PreviewStringFilterMenu.prototype.actionEnabled = function () {
        var regexErrorMessage = this.state.regexErrorMessage;
        var essence = this.props.essence;
        if (regexErrorMessage)
            return false;
        return !essence.filter.equals(this.constructFilter());
    };
    PreviewStringFilterMenu.prototype.renderRows = function () {
        var _a = this.state, loading = _a.loading, dataset = _a.dataset, fetchQueued = _a.fetchQueued, regexErrorMessage = _a.regexErrorMessage;
        var _b = this.props, dimension = _b.dimension, searchText = _b.searchText, filterMode = _b.filterMode;
        var rows = [];
        var search = null;
        if (dataset) {
            var rowStrings = dataset.data.slice(0, TOP_N).map(function (d) { return d[dimension.name]; });
            if (searchText) {
                rowStrings = rowStrings.filter(function (d) {
                    if (filterMode === index_1.Filter.REGEX) {
                        try {
                            var escaped = searchText.replace(/\\[^\\]]/g, '\\\\');
                            search = new RegExp(escaped);
                            return search.test(String(d));
                        }
                        catch (e) {
                            return false;
                        }
                    }
                    else if (filterMode === index_1.Filter.CONTAINS) {
                        search = searchText;
                        return String(d).toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
                    }
                    return false;
                });
            }
            rows = rowStrings.map(function (segmentValue) {
                var segmentValueStr = String(segmentValue);
                return React.createElement("div", {className: "row no-select", key: segmentValueStr, title: segmentValueStr}, 
                    React.createElement("div", {className: "row-wrapper"}, 
                        React.createElement(highlight_string_1.HighlightString, {className: "label", text: segmentValueStr, highlight: search})
                    )
                );
            });
        }
        var grayMessage = null;
        if (regexErrorMessage) {
            grayMessage = React.createElement("div", {className: "message"}, regexErrorMessage);
        }
        else if (!loading && dataset && !fetchQueued && searchText && !rows.length) {
            grayMessage = React.createElement("div", {className: "message"}, 'No results for "' + searchText + '"');
        }
        return React.createElement("div", {className: "rows"}, 
            (rows.length === 0 || !searchText) ? null : React.createElement("div", {className: "matching-values-message"}, "Matching Values"), 
            rows, 
            grayMessage);
    };
    PreviewStringFilterMenu.prototype.render = function () {
        var filterMode = this.props.filterMode;
        var _a = this.state, dataset = _a.dataset, loading = _a.loading, queryError = _a.queryError;
        var hasMore = dataset && dataset.data.length > TOP_N;
        return React.createElement("div", {className: dom_1.classNames("string-filter-menu", filterMode)}, 
            React.createElement(global_event_listener_1.GlobalEventListener, {keyDown: this.globalKeyDownListener.bind(this)}), 
            React.createElement("div", {className: dom_1.classNames('menu-table', hasMore ? 'has-more' : 'no-more')}, 
                this.renderRows(), 
                queryError ? React.createElement(query_error_1.QueryError, {error: queryError}) : null, 
                loading ? React.createElement(loader_1.Loader, null) : null), 
            React.createElement("div", {className: "ok-cancel-bar"}, 
                React.createElement(button_1.Button, {type: "primary", title: constants_1.STRINGS.ok, onClick: this.onOkClick.bind(this), disabled: !this.actionEnabled()}), 
                React.createElement(button_1.Button, {type: "secondary", title: constants_1.STRINGS.cancel, onClick: this.onCancelClick.bind(this)})));
    };
    return PreviewStringFilterMenu;
}(React.Component));
exports.PreviewStringFilterMenu = PreviewStringFilterMenu;
