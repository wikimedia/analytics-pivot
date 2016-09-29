"use strict";
var express_1 = require('express');
var plywood_1 = require('plywood');
var chronoshift_1 = require('chronoshift');
var router = express_1.Router();
router.post('/', function (req, res) {
    var _a = req.body, dataCube = _a.dataCube, dataSource = _a.dataSource, expression = _a.expression, timezone = _a.timezone, settingsVersion = _a.settingsVersion;
    dataCube = dataCube || dataSource;
    if (typeof dataCube !== 'string') {
        res.status(400).send({
            error: 'must have a dataCube'
        });
        return;
    }
    var queryTimezone = null;
    if (typeof timezone === 'string') {
        try {
            queryTimezone = chronoshift_1.Timezone.fromJS(timezone);
        }
        catch (e) {
            res.status(400).send({
                error: 'bad timezone',
                message: e.message
            });
            return;
        }
    }
    var ex = null;
    try {
        ex = plywood_1.Expression.fromJS(expression);
    }
    catch (e) {
        res.status(400).send({
            error: 'bad expression',
            message: e.message
        });
        return;
    }
    req.getSettings(dataCube)
        .then(function (appSettings) {
        var myDataCube = appSettings.getDataCube(dataCube);
        if (!myDataCube) {
            res.status(400).send({ error: 'unknown data cube' });
            return null;
        }
        if (!myDataCube.executor) {
            res.status(400).send({ error: 'un queryable data cube' });
            return null;
        }
        return myDataCube.executor(ex, { timezone: queryTimezone }).then(function (data) {
            var reply = {
                result: plywood_1.Dataset.isDataset(data) ? data.toJS() : data
            };
            res.json(reply);
        }, function (e) {
            console.log('error:', e.message);
            if (e.hasOwnProperty('stack')) {
                console.log(e.stack);
            }
            res.status(500).send({
                error: 'could not compute',
                message: e.message
            });
        });
    })
        .done();
});
module.exports = router;
