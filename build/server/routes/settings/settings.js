"use strict";
var express_1 = require('express');
var index_1 = require('../../../common/models/index');
var index_2 = require('../../../common/manifests/index');
var config_1 = require('../../config');
var router = express_1.Router();
router.get('/', function (req, res) {
    config_1.SETTINGS_MANAGER.getSettings()
        .then(function (appSettings) {
        res.send({ appSettings: appSettings });
    }, function (e) {
        console.log('error:', e.message);
        if (e.hasOwnProperty('stack')) {
            console.log(e.stack);
        }
        res.status(500).send({
            error: 'could not compute',
            message: e.message
        });
    })
        .done();
});
router.post('/', function (req, res) {
    var appSettings = req.body.appSettings;
    try {
        var appSettingsObject = index_1.AppSettings.fromJS(appSettings, { visualizations: index_2.MANIFESTS });
    }
    catch (e) {
        res.status(400).send({
            error: 'bad settings',
            message: e.message
        });
        return;
    }
    config_1.SETTINGS_MANAGER.updateSettings(appSettingsObject)
        .then(function () {
        res.send({ status: 'ok' });
    }, function (e) {
        console.log('error:', e.message);
        if (e.hasOwnProperty('stack')) {
            console.log(e.stack);
        }
        res.status(500).send({
            error: 'could not compute',
            message: e.message
        });
    })
        .done();
});
module.exports = router;
