"use strict";
var express = require('express');
var hsts = require('hsts');
var path = require('path');
var bodyParser = require('body-parser');
var compress = require('compression');
var logger_tracker_1 = require('logger-tracker');
var chronoshift_1 = require('chronoshift');
if (!chronoshift_1.WallTime.rules) {
    var tzData = require("chronoshift/lib/walltime/walltime-data.js");
    chronoshift_1.WallTime.init(tzData.rules, tzData.zones);
}
var config_1 = require('./config');
var plywoodRoutes = require('./routes/plywood/plywood');
var plyqlRoutes = require('./routes/plyql/plyql');
var pivotRoutes = require('./routes/pivot/pivot');
var collectionsRoutes = require('./routes/collections/collections');
var settingsRoutes = require('./routes/settings/settings');
var mkurlRoutes = require('./routes/mkurl/mkurl');
var healthRoutes = require('./routes/health/health');
var errorRoutes = require('./routes/error/error');
var views_1 = require('./views');
function makeGuard(guard) {
    return function (req, res, next) {
        var user = req.user;
        if (!user) {
            next(new Error('no user'));
            return;
        }
        var allow = user.allow;
        if (!allow) {
            next(new Error('no user.allow'));
            return;
        }
        if (!allow[guard]) {
            next(new Error('not allowed'));
            return;
        }
        next();
    };
}
var app = express();
app.disable('x-powered-by');
if (config_1.SERVER_SETTINGS.getTrustProxy() === 'always') {
    app.set('trust proxy', 1);
}
function addRoutes(attach, router) {
    app.use(attach, router);
    app.use(config_1.SERVER_SETTINGS.getServerRoot() + attach, router);
}
function addGuardedRoutes(attach, guard, router) {
    var guardHandler = makeGuard(guard);
    app.use(attach, guardHandler, router);
    app.use(config_1.SERVER_SETTINGS.getServerRoot() + attach, guardHandler, router);
}
app.use(compress());
app.use(logger_tracker_1.logAndTrack(config_1.SERVER_SETTINGS.getRequestLogFormat()));
if (config_1.SERVER_SETTINGS.getStrictTransportSecurity() === "always") {
    app.use(hsts({
        maxAge: 10886400000,
        includeSubDomains: true,
        preload: true
    }));
}
addRoutes('/health', healthRoutes);
addRoutes('/', express.static(path.join(__dirname, '../../build/public')));
addRoutes('/', express.static(path.join(__dirname, '../../assets')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var stateful = config_1.SETTINGS_MANAGER.isStateful();
app.use(function (req, res, next) {
    req.user = null;
    req.version = config_1.VERSION;
    req.stateful = stateful;
    req.getSettings = function (opts) {
        if (opts === void 0) { opts = {}; }
        return config_1.SETTINGS_MANAGER.getSettings(opts);
    };
    next();
});
app.use(function (req, res, next) {
    var version = req.body.version;
    if (version && version !== req.version) {
        res.status(412).send({
            error: 'incorrect version',
            action: 'reload'
        });
        return;
    }
    next();
});
if (config_1.AUTH) {
    app.use(config_1.AUTH);
}
else {
    app.use(function (req, res, next) {
        if (req.stateful) {
            req.user = {
                id: 'admin',
                email: 'admin@admin.com',
                displayName: 'Admin',
                allow: {
                    settings: true
                }
            };
        }
        next();
    });
}
addRoutes('/plywood', plywoodRoutes);
addRoutes('/plyql', plyqlRoutes);
addRoutes('/mkurl', mkurlRoutes);
addRoutes('/error', errorRoutes);
if (stateful) {
    addRoutes('/collections', collectionsRoutes);
    addGuardedRoutes('/settings', 'settings', settingsRoutes);
}
if (config_1.SERVER_SETTINGS.getIframe() === 'deny') {
    app.use(function (req, res, next) {
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
        next();
    });
}
addRoutes('/', pivotRoutes);
app.use(function (req, res, next) {
    res.redirect('/');
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        logger_tracker_1.LOGGER.error("Server Error: " + err.message);
        logger_tracker_1.LOGGER.error(err.stack);
        res.status(err.status || 500);
        res.send(views_1.errorLayout({ version: config_1.VERSION, title: 'Error' }, err.message, err));
    });
}
app.use(function (err, req, res, next) {
    logger_tracker_1.LOGGER.error("Server Error: " + err.message);
    logger_tracker_1.LOGGER.error(err.stack);
    res.status(err.status || 500);
    res.send(views_1.errorLayout({ version: config_1.VERSION, title: 'Error' }, err.message));
});
module.exports = app;
