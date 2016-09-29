"use strict";
var express_1 = require('express');
var index_1 = require('../../../common/models/index');
var manifests_1 = require('../../../common/manifests');
var router = express_1.Router();
router.post('/', function (req, res) {
    var _a = req.body, domain = _a.domain, dataCube = _a.dataCube, dataSource = _a.dataSource, essence = _a.essence;
    dataCube = dataCube || dataSource;
    if (typeof domain !== 'string') {
        res.status(400).send({
            error: 'must have a domain'
        });
        return;
    }
    if (typeof dataCube !== 'string') {
        res.status(400).send({
            error: 'must have a dataCube'
        });
        return;
    }
    if (typeof essence !== 'object') {
        res.status(400).send({
            error: 'essence must be an object'
        });
        return;
    }
    req.getSettings(dataCube)
        .then(function (appSettings) {
        var myDataCube = appSettings.getDataCube(dataCube);
        if (!myDataCube) {
            res.status(400).send({ error: 'unknown data cube' });
            return;
        }
        try {
            var essenceObj = index_1.Essence.fromJS(essence, {
                dataCube: myDataCube,
                visualizations: manifests_1.MANIFESTS
            });
        }
        catch (e) {
            res.status(400).send({
                error: 'invalid essence',
                message: e.message
            });
            return;
        }
        res.json({
            url: essenceObj.getURL(domain + "#" + myDataCube.name + "/")
        });
    })
        .done();
});
module.exports = router;
