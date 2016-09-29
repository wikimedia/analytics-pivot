"use strict";
var chai_1 = require('chai');
var immutable_class_tester_1 = require('immutable-class-tester');
var server_settings_1 = require('./server-settings');
describe('ServerSettings', function () {
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(server_settings_1.ServerSettings, [
            {},
            {
                port: 9090
            },
            {
                port: 9091
            },
            {
                port: 9091,
                trustProxy: "always"
            },
            {
                port: 9090,
                serverRoot: '/pivots',
                pageMustLoadTimeout: 900,
                iframe: 'deny'
            },
            {
                port: 9091,
                serverRoot: '/pivots',
                pageMustLoadTimeout: 901
            },
            {
                port: 9091,
                serverHost: '10.20.30.40',
                serverRoot: '/pivots',
                pageMustLoadTimeout: 901
            },
            {
                port: 9091,
                trackingUrl: 'http://mytracker-is-cool.io/trackz',
                trackingContext: {
                    service: 'me'
                }
            },
            {
                port: 9091,
                auth: 'my_auth.js'
            },
            {
                port: 9091,
                settingsLocation: {
                    location: 'file',
                    uri: 'path/to/my/file.yaml'
                }
            }
        ]);
    });
    describe("upgrades", function () {
        it("port", function () {
            chai_1.expect(server_settings_1.ServerSettings.fromJS({
                port: '9090',
                serverRoot: '/pivots',
                pageMustLoadTimeout: 900,
                iframe: 'deny'
            }).toJS()).to.deep.equal({
                port: 9090,
                serverRoot: '/pivots',
                pageMustLoadTimeout: 900,
                iframe: 'deny'
            });
        });
    });
});
