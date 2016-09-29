"use strict";
var chai_1 = require('chai');
var express = require('express');
var supertest = require('supertest');
var bodyParser = require('body-parser');
var errorRouter = require('./error');
var app = express();
app.use(bodyParser.json());
app.use('/', errorRouter);
describe('error route', function () {
    var originalConsoleError;
    var consoleError = "";
    before(function () {
        originalConsoleError = console.error;
        console.error = function (t) {
            consoleError += t;
        };
    });
    var errorObj = {
        message: "Uncaught TypeError: Cannot read property 'start' of null",
        file: "http://localhost:9090/pivot-main.9dcd61eb37d2c3c22868.js",
        line: 52026,
        column: 50,
        stack: "TypeError: Cannot read property 'start' of null\n    " +
            "at LineChart.floorRange (http://localhost:9090/pivot-main.9dcd61eb37d2c3c22868.js:52026:50)\n    " +
            "at LineChart.globalMouseUpListener (http://localhost:9090/pivot-main.9dcd61eb37d2c3c22868.js:52052:36)"
    };
    it('gets a 200', function (testComplete) {
        supertest(app)
            .post('/')
            .set('Content-Type', "application/json")
            .send(errorObj)
            .expect(200)
            .end(function (err, res) {
            chai_1.expect(consoleError).to.deep.equal('Client Error: ' + JSON.stringify(errorObj));
            testComplete();
        });
    });
    it('validates error has a message', function (testComplete) {
        supertest(app)
            .post('/')
            .set('Content-Type', "application/json")
            .send({ query: 'select things' })
            .expect(400)
            .end(function (err, res) {
            chai_1.expect(res.body.error).to.deep.equal('Error must have a message');
            testComplete();
        });
    });
    after(function () {
        console.error = originalConsoleError;
    });
});
