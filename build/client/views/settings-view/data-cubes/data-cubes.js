"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./data-cubes.css');
var React = require('react');
var index_1 = require('../../../components/index');
var DataCubes = (function (_super) {
    __extends(DataCubes, _super);
    function DataCubes() {
        _super.call(this);
        this.state = {};
    }
    DataCubes.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.settings)
            this.setState({
                newSettings: nextProps.settings,
                hasChanged: false
            });
    };
    DataCubes.prototype.editCube = function (cube) {
        window.location.hash += "/" + cube.name;
    };
    DataCubes.prototype.removeCube = function (cube) {
        var _this = this;
        var remove = function () {
            var settings = _this.state.newSettings;
            var index = settings.dataCubes.indexOf(cube);
            if (index < 0)
                return;
            var newCubes = settings.dataCubes;
            newCubes.splice(index, 1);
            _this.props.onSave(settings.changeDataCubes(newCubes), 'Cube removed');
            index_1.Notifier.removeQuestion();
        };
        var cancel = function () {
            index_1.Notifier.removeQuestion();
        };
        index_1.Notifier.ask({
            title: 'Remove this cube',
            message: [
                ("Are you sure you would like to delete the data cube \"" + cube.title + "\"?"),
                'This action is not reversible.'
            ],
            choices: [
                { label: 'Remove', callback: remove, type: 'warn' },
                { label: 'Cancel', callback: cancel, type: 'secondary' }
            ],
            onClose: index_1.Notifier.removeQuestion
        });
    };
    DataCubes.prototype.startSeed = function () {
        window.location.hash += '/new-data-cube';
    };
    DataCubes.prototype.renderEmpty = function () {
        return React.createElement("div", {className: "data-cubes empty"}, 
            React.createElement("div", {className: "title"}, "No data cubes"), 
            React.createElement("div", {className: "subtitle actionable", onClick: this.startSeed.bind(this)}, "Create a new data cube"));
    };
    DataCubes.prototype.render = function () {
        var newSettings = this.state.newSettings;
        if (!newSettings)
            return null;
        if (!newSettings.dataCubes.length)
            return this.renderEmpty();
        var columns = [
            { label: 'Name', field: 'title', width: 170, cellIcon: 'full-cube' },
            { label: 'Source', field: 'source', width: 400 },
            { label: 'Dimensions', field: function (cube) { return cube.dimensions.size; }, width: 120 },
            { label: 'Measures', field: function (cube) { return cube.measures.size; }, width: 80 }
        ];
        var actions = [
            { icon: 'full-edit', callback: this.editCube.bind(this) },
            { icon: 'full-remove', callback: this.removeCube.bind(this) }
        ];
        return React.createElement("div", {className: "data-cubes"}, 
            React.createElement("div", {className: "title-bar"}, 
                React.createElement("div", {className: "title"}, "Data Cubes"), 
                React.createElement(index_1.Button, {className: "save", title: "Add a cube", type: "primary", onClick: this.startSeed.bind(this)})), 
            React.createElement("div", {className: "content"}, 
                React.createElement(index_1.SimpleTable, {columns: columns, rows: newSettings.dataCubes, actions: actions, onRowClick: this.editCube.bind(this)})
            ));
    };
    return DataCubes;
}(React.Component));
exports.DataCubes = DataCubes;
