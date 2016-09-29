"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./simple-table.css');
var React = require('react');
var dom_1 = require('../../utils/dom/dom');
var svg_icon_1 = require('../svg-icon/svg-icon');
var scroller_1 = require('../scroller/scroller');
var ROW_HEIGHT = 42;
var HEADER_HEIGHT = 26;
var ACTION_WIDTH = 30;
var SimpleTable = (function (_super) {
    __extends(SimpleTable, _super);
    function SimpleTable() {
        _super.call(this);
        this.state = {};
    }
    SimpleTable.prototype.renderHeaders = function (columns, sortColumn, sortAscending) {
        var items = [];
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            var icon = null;
            if (sortColumn && sortColumn === column) {
                icon = React.createElement(svg_icon_1.SvgIcon, {svg: require('../../icons/sort-arrow.svg'), className: "sort-arrow " + (sortAscending ? 'ascending' : 'descending')});
            }
            items.push(React.createElement("div", {className: "header", style: { width: column.width }, key: "column-" + i}, 
                column.label, 
                icon));
        }
        return React.createElement("div", {className: "column-headers"}, items);
    };
    SimpleTable.prototype.getIcons = function (row, actions) {
        if (!actions || !actions.length)
            return null;
        var items = [];
        for (var i = 0; i < actions.length; i++) {
            var action = actions[i];
            items.push(React.createElement("div", {className: 'cell action', key: "action-" + i, onClick: action.callback.bind(this, row)}, 
                React.createElement(svg_icon_1.SvgIcon, {svg: require("../../icons/" + action.icon + ".svg")})
            ));
        }
        return items;
    };
    SimpleTable.prototype.labelizer = function (column) {
        if (typeof column.field === 'string') {
            return function (row) { return row[column.field]; };
        }
        return column.field;
    };
    SimpleTable.prototype.renderRow = function (row, columns, index) {
        var hoveredRowIndex = this.state.hoveredRowIndex;
        var items = [];
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            var icon = col.cellIcon ? React.createElement(svg_icon_1.SvgIcon, {svg: require("../../icons/" + col.cellIcon + ".svg")}) : null;
            items.push(React.createElement("div", {className: dom_1.classNames('cell', { 'has-icon': !!col.cellIcon }), style: { width: col.width }, key: "cell-" + i}, 
                icon, 
                this.labelizer(col)(row)));
        }
        return React.createElement("div", {className: dom_1.classNames('row', { hover: hoveredRowIndex === index }), key: "row-" + index, style: { height: ROW_HEIGHT }}, items);
    };
    SimpleTable.prototype.sortRows = function (rows, sortColumn, sortAscending) {
        if (!sortColumn)
            return rows;
        var labelize = this.labelizer(sortColumn);
        if (sortAscending) {
            return rows.sort(function (a, b) {
                if (labelize(a) < labelize(b)) {
                    return -1;
                }
                else if (labelize(a) > labelize(b)) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }
        return rows.sort(function (a, b) {
            if (labelize(a) < labelize(b)) {
                return 1;
            }
            else if (labelize(a) > labelize(b)) {
                return -1;
            }
            else {
                return 0;
            }
        });
    };
    SimpleTable.prototype.renderRows = function (rows, columns, sortColumn, sortAscending) {
        if (!rows || !rows.length)
            return null;
        rows = this.sortRows(rows, sortColumn, sortAscending);
        var items = [];
        for (var i = 0; i < rows.length; i++) {
            items.push(this.renderRow(rows[i], columns, i));
        }
        return items;
    };
    SimpleTable.prototype.getLayout = function (columns, rows, actions) {
        var width = columns.reduce(function (a, b) { return a + b.width; }, 0);
        var directActionsCount = actions.filter(function (a) { return !a.inEllipsis; }).length;
        var indirectActionsCount = directActionsCount !== actions.length ? 1 : 0;
        return {
            bodyWidth: width,
            bodyHeight: rows.length * ROW_HEIGHT,
            top: HEADER_HEIGHT,
            right: directActionsCount * 30 + indirectActionsCount * 30,
            bottom: 0,
            left: 0
        };
    };
    SimpleTable.prototype.getDirectActions = function (actions) {
        return actions.filter(function (action) { return !action.inEllipsis; });
    };
    SimpleTable.prototype.renderActions = function (rows, actions) {
        var _a = this.state, hoveredRowIndex = _a.hoveredRowIndex, hoveredActionIndex = _a.hoveredActionIndex;
        var directActions = this.getDirectActions(actions);
        var generator = function (row, i) {
            var isRowHovered = i === hoveredRowIndex;
            var icons = directActions.map(function (action, j) {
                return React.createElement("div", {className: dom_1.classNames("icon", { hover: isRowHovered && j === hoveredActionIndex }), key: "icon-" + j, style: { width: ACTION_WIDTH }}, 
                    React.createElement(svg_icon_1.SvgIcon, {svg: require("../../icons/" + action.icon + ".svg")})
                );
            });
            return React.createElement("div", {className: dom_1.classNames("row action", { hover: isRowHovered }), key: "action-" + i, style: { height: ROW_HEIGHT }}, icons);
        };
        return rows.map(generator);
    };
    SimpleTable.prototype.getRowIndex = function (y) {
        var rowIndex = -1;
        if (y > HEADER_HEIGHT) {
            rowIndex = Math.floor((y - HEADER_HEIGHT) / ROW_HEIGHT);
        }
        return rowIndex;
    };
    SimpleTable.prototype.getActionIndex = function (x, headerWidth) {
        var actions = this.props.actions;
        return Math.floor((x - headerWidth) / ACTION_WIDTH);
    };
    SimpleTable.prototype.getColumnIndex = function (x, headerWidth) {
        if (x >= headerWidth)
            return -1;
        var columns = this.props.columns;
        var columnIndex = 0;
        while ((x -= columns[columnIndex].width) > 0)
            columnIndex++;
        return columnIndex;
    };
    SimpleTable.prototype.getHeaderWidth = function (columns) {
        return columns.reduce(function (a, b) { return a + b.width; }, 0);
    };
    SimpleTable.prototype.onClick = function (x, y, part) {
        var _a = this.props, columns = _a.columns, rows = _a.rows, actions = _a.actions;
        if (part === scroller_1.Scroller.TOP_RIGHT_CORNER)
            return;
        var headerWidth = this.getHeaderWidth(columns);
        var columnIndex = this.getColumnIndex(x, headerWidth);
        var rowIndex = this.getRowIndex(y);
        if (part === scroller_1.Scroller.RIGHT_GUTTER) {
            var action = actions[this.getActionIndex(x, headerWidth)];
            if (action) {
                this.onActionClick(action, rows[rowIndex]);
                return;
            }
        }
        if (part === scroller_1.Scroller.TOP_GUTTER) {
            this.onHeaderClick(columns[columnIndex]);
            return;
        }
        this.onCellClick(rows[rowIndex], columns[columnIndex]);
    };
    SimpleTable.prototype.onCellClick = function (row, column) {
        if (this.props.onRowClick && row) {
            this.props.onRowClick(row);
        }
    };
    SimpleTable.prototype.onHeaderClick = function (column) {
        this.setState({
            sortColumn: column,
            sortAscending: this.state.sortColumn === column ? !this.state.sortAscending : true
        });
    };
    SimpleTable.prototype.onActionClick = function (action, row) {
        action.callback(row);
    };
    SimpleTable.prototype.onMouseMove = function (x, y, part) {
        var _a = this.props, rows = _a.rows, columns = _a.columns;
        var headerWidth = this.getHeaderWidth(columns);
        var rowIndex = this.getRowIndex(y);
        this.setState({
            hoveredRowIndex: rowIndex > rows.length ? undefined : rowIndex,
            hoveredActionIndex: part === scroller_1.Scroller.RIGHT_GUTTER ? this.getActionIndex(x, headerWidth) : undefined
        });
    };
    SimpleTable.prototype.onMouseLeave = function () {
        this.setState({
            hoveredRowIndex: undefined,
            hoveredActionIndex: undefined
        });
    };
    SimpleTable.prototype.render = function () {
        var _a = this.props, columns = _a.columns, rows = _a.rows, actions = _a.actions;
        var _b = this.state, sortColumn = _b.sortColumn, sortAscending = _b.sortAscending, hoveredRowIndex = _b.hoveredRowIndex;
        if (!columns)
            return null;
        return React.createElement("div", {className: dom_1.classNames("simple-table", { clickable: hoveredRowIndex !== undefined })}, 
            React.createElement(scroller_1.Scroller, {ref: "scroller", layout: this.getLayout(columns, rows, actions), topRightCorner: React.createElement("div", null), topGutter: this.renderHeaders(columns, sortColumn, sortAscending), rightGutter: this.renderActions(rows, actions), body: this.renderRows(rows, columns, sortColumn, sortAscending), onClick: this.onClick.bind(this), onMouseMove: this.onMouseMove.bind(this), onMouseLeave: this.onMouseLeave.bind(this)})
        );
    };
    return SimpleTable;
}(React.Component));
exports.SimpleTable = SimpleTable;
