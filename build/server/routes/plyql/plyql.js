"use strict";
var express_1 = require('express');
var plywood_1 = require('plywood');
var router = express_1.Router();
var outputFunctions = {
    json: function (data) { return JSON.stringify(data, null, 2); },
    csv: function (data) { return data.toCSV(); },
    tsv: function (data) { return data.toTSV(); }
};
router.post('/', function (req, res) {
    var _a = req.body, outputType = _a.outputType, query = _a.query;
    if (typeof query !== "string") {
        var errmsg = "Query must be a string";
        res.status(400).send(errmsg);
        return;
    }
    try {
        var parsedSQL = plywood_1.Expression.parseSQL(query);
    }
    catch (e) {
        var errmsg = "Could not parse query as SQL: " + e.message;
        res.status(400).send(errmsg);
        return;
    }
    if (typeof outputType !== "string") {
        outputType = "json";
    }
    var outputFn;
    outputFn = outputFunctions[outputType];
    if (outputFn === undefined) {
        var errmsg = "Invalid output type: " + outputType;
        res.status(400).send(errmsg);
        return;
    }
    var parsedQuery = parsedSQL.expression;
    var dataCube = parsedSQL.table;
    if (!dataCube) {
        var errmsg = "Could not determine data cube name";
        res.status(400).send(errmsg);
        return;
    }
    parsedQuery = parsedQuery.substitute(function (ex) {
        if (ex instanceof plywood_1.RefExpression && ex.name === dataCube) {
            return plywood_1.$("main");
        }
        return null;
    });
    req.getSettings(dataCube)
        .then(function (appSettings) {
        var myDataCube = appSettings.getDataCube(dataCube);
        if (!myDataCube) {
            res.status(400).send({ error: 'unknown data cube' });
            return;
        }
        myDataCube.executor(parsedQuery).then(function (data) {
            res.type(outputType);
            res.send(outputFn(plywood_1.Dataset.fromJS(data.toJS())));
        }, function (error) {
            res.status(500).send("got error " + error.message);
        });
    })
        .done();
});
module.exports = router;
