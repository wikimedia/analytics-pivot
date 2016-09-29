"use strict";
var debugModule = require('debug');
var http = require('http');
var app = require('./app');
var config_1 = require('./config');
if (config_1.START_SERVER) {
    var debug = debugModule('pivot:www');
    var server = http.createServer(app);
    server.on('error', function (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        switch (error.code) {
            case 'EACCES':
                console.error("Port " + config_1.SERVER_SETTINGS.getPort() + " requires elevated privileges");
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error("Port " + config_1.SERVER_SETTINGS.getPort() + " is already in use");
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    server.on('listening', function () {
        var address = server.address();
        console.log("Pivot is listening on address " + address.address + " port " + address.port);
        debug("Pivot is listening on address " + address.address + " port " + address.port);
    });
    app.set('port', config_1.SERVER_SETTINGS.getPort());
    server.listen(config_1.SERVER_SETTINGS.getPort(), config_1.SERVER_SETTINGS.getServerHost());
}
