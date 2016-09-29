"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./selectable-string-filter-menu.css');
var React = require("react");
var plywood_1 = require("plywood");
var general_1 = require("../../../common/utils/general/general");
var constants_1 = require("../../config/constants");
var index_1 = require("../../../common/models/index");
var dom_1 = require("../../utils/dom/dom");
var checkbox_1 = require("../checkbox/checkbox");
var loader_1 = require("../loader/loader");
var query_error_1 = require("../query-error/query-error");
var highlight_string_1 = require("../highlight-string/highlight-string");
var button_1 = require("../button/button");
var global_event_listener_1 = require("../global-event-listener/global-event-listener");
var TOP_N = 100;
var SelectableStringFilterMenu = (function (_super) {
    __extends(SelectableStringFilterMenu, _super);
    function SelectableStringFilterMenu() {
        var _this = this;
        _super.call(this);
        this.state = {
            loading: false,
            dataset: null,
            error: null,
            fetchQueued: false,
            selectedValues: null,
            promotedValues: null,
            colors: null
        };
        this.collectTriggerSearch = general_1.collect(constants_1.SEARCH_WAIT, function () {
            if (!_this.mounted)
                return;
            var _a = _this.props, essence = _a.essence, timekeeper = _a.timekeeper, dimension = _a.dimension, searchText = _a.searchText;
            _this.fetchData(essence, timekeeper, dimension, searchText);
        });
    }
    SelectableStringFilterMenu.prototype.fetchData = function (essence, timekeeper, dimension, searchText) {
        var _this = this;
        var dataCube = essence.dataCube;
        var nativeCount = dataCube.getMeasure('count');
        var measureExpression = nativeCount ? nativeCount.expression : plywood_1.$('main').count();
        var filterExpression = essence.getEffectiveFilter(timekeeper, null, dimension).toExpression();
        if (searchText) {
            filterExpression = filterExpression.and(dimension.expression.contains(plywood_1.r(searchText), 'ignoreCase'));
        }
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
                error: null
            });
        }, function (error) {
            if (!_this.mounted)
                return;
            _this.setState({
                loading: false,
                dataset: null,
                error: error
            });
        });
    };
    SelectableStringFilterMenu.prototype.componentWillMount = function () {
        var _a = this.props, essence = _a.essence, timekeeper = _a.timekeeper, dimension = _a.dimension, searchText = _a.searchText;
        var filter = essence.filter, colors = essence.colors;
        var myColors = (colors && colors.dimension === dimension.name ? colors : null);
        var existingMode = filter.getModeForDimension(dimension);
        var valueSet = filter.getLiteralSet(dimension.expression);
        var selectedValues = (existingMode !== 'match' && valueSet) || (myColors ? myColors.toSet() : null) || plywood_1.Set.EMPTY;
        this.setState({
            selectedValues: selectedValues,
            promotedValues: selectedValues,
            colors: myColors
        });
        this.fetchData(essence, timekeeper, dimension, searchText);
    };
    SelectableStringFilterMenu.prototype.componentDidMount = function () {
        this.mounted = true;
    };
    SelectableStringFilterMenu.prototype.componentWillUnmount = function () {
        this.mounted = false;
    };
    SelectableStringFilterMenu.prototype.componentWillReceiveProps = function (nextProps) {
        var searchText = this.props.searchText;
        var _a = this.state, fetchQueued = _a.fetchQueued, loading = _a.loading, dataset = _a.dataset;
        if (nextProps.searchText && nextProps.searchText.indexOf(searchText) !== -1 && !fetchQueued && !loading && dataset && dataset.data.length < TOP_N) {
            return;
        }
        else {
            this.setState({
                fetchQueued: true
            });
            this.collectTriggerSearch();
        }
    };
    SelectableStringFilterMenu.prototype.globalKeyDownListener = function (e) {
        if (dom_1.enterKey(e)) {
            this.onOkClick();
        }
    };
    SelectableStringFilterMenu.prototype.constructFilter = function () {
        var _a = this.props, dimension = _a.dimension, filterMode = _a.filterMode, onClauseChange = _a.onClauseChange;
        var selectedValues = this.state.selectedValues;
        var expression = dimension.expression;
        var clause = null;
        if (selectedValues.size()) {
            clause = new index_1.FilterClause({
                expression: expression,
                selection: plywood_1.r(selectedValues),
                exclude: filterMode === index_1.Filter.EXCLUDED
            });
        }
        return onClauseChange(clause);
    };
    SelectableStringFilterMenu.prototype.onValueClick = function (value, e) {
        var _a = this.state, selectedValues = _a.selectedValues, colors = _a.colors;
        if (colors) {
            colors = colors.toggle(value);
            selectedValues = selectedValues.toggle(value);
        }
        else {
            if (e.altKey || e.ctrlKey || e.metaKey) {
                if (selectedValues.contains(value) && selectedValues.size() === 1) {
                    selectedValues = plywood_1.Set.EMPTY;
                }
                else {
                    selectedValues = plywood_1.Set.EMPTY.add(value);
                }
            }
            else {
                selectedValues = selectedValues.toggle(value);
            }
        }
        this.setState({
            selectedValues: selectedValues,
            colors: colors
        });
    };
    SelectableStringFilterMenu.prototype.onOkClick = function () {
        if (!this.actionEnabled())
            return;
        var _a = this.props, clicker = _a.clicker, onClose = _a.onClose;
        var colors = this.state.colors;
        clicker.changeFilter(this.constructFilter(), colors);
        onClose();
    };
    SelectableStringFilterMenu.prototype.onCancelClick = function () {
        var onClose = this.props.onClose;
        onClose();
    };
    SelectableStringFilterMenu.prototype.actionEnabled = function () {
        var essence = this.props.essence;
        return !essence.filter.equals(this.constructFilter());
    };
    SelectableStringFilterMenu.prototype.renderRows = function () {
        var _this = this;
        var _a = this.state, loading = _a.loading, dataset = _a.dataset, fetchQueued = _a.fetchQueued, selectedValues = _a.selectedValues, promotedValues = _a.promotedValues;
        var _b = this.props, dimension = _b.dimension, filterMode = _b.filterMode, searchText = _b.searchText;
        var rows = [];
        if (dataset) {
            var promotedElements = promotedValues ? promotedValues.elements : [];
            var rowData = dataset.data.slice(0, TOP_N).filter(function (d) {
                return promotedElements.indexOf(d[dimension.name]) === -1;
            });
            var rowStrings = promotedElements.concat(rowData.map(function (d) { return d[dimension.name]; }));
            if (searchText) {
                var searchTextLower = searchText.toLowerCase();
                rowStrings = rowStrings.filter(function (d) {
                    return String(d).toLowerCase().indexOf(searchTextLower) !== -1;
                });
            }
            var checkboxType = filterMode === index_1.Filter.EXCLUDED ? 'cross' : 'check';
            rows = rowStrings.map(function (segmentValue) {
                var segmentValueStr = String(segmentValue);
                var selected = selectedValues && selectedValues.contains(segmentValue);
                return React.createElement("div", {className: dom_1.classNames('row', { 'selected': selected }), key: segmentValueStr, title: segmentValueStr, onClick: _this.onValueClick.bind(_this, segmentValue)}, 
                    React.createElement("div", {className: "row-wrapper"}, 
                        React.createElement(checkbox_1.Checkbox, {type: checkboxType, selected: selected}), 
                        React.createElement(highlight_string_1.HighlightString, {className: "label", text: segmentValueStr, highlight: searchText}))
                );
            });
        }
        var message = null;
        if (!loading && dataset && !fetchQueued && searchText && !rows.length) {
            message = React.createElement("div", {className: "message"}, 'No results for "' + searchText + '"');
        }
        return React.createElement("div", {className: "rows"}, 
            rows, 
            message);
    };
    SelectableStringFilterMenu.prototype.render = function () {
        var filterMode = this.props.filterMode;
        var _a = this.state, dataset = _a.dataset, loading = _a.loading, error = _a.error;
        var hasMore = dataset && dataset.data.length > TOP_N;
        return React.createElement("div", {className: dom_1.classNames("string-filter-menu", filterMode)}, 
            React.createElement(global_event_listener_1.GlobalEventListener, {keyDown: this.globalKeyDownListener.bind(this)}), 
            React.createElement("div", {className: dom_1.classNames('menu-table', hasMore ? 'has-more' : 'no-more')}, 
                this.renderRows(), 
                error ? React.createElement(query_error_1.QueryError, {error: error}) : null, 
                loading ? React.createElement(loader_1.Loader, null) : null), 
            React.createElement("div", {className: "ok-cancel-bar"}, 
                React.createElement(button_1.Button, {type: "primary", title: constants_1.STRINGS.ok, onClick: this.onOkClick.bind(this), disabled: !this.actionEnabled()}), 
                React.createElement(button_1.Button, {type: "secondary", title: constants_1.STRINGS.cancel, onClick: this.onCancelClick.bind(this)})));
    };
    return SelectableStringFilterMenu;
}(React.Component));
exports.SelectableStringFilterMenu = SelectableStringFilterMenu;
