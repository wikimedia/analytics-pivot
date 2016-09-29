"use strict";
var chai_1 = require('chai');
var immutable_class_tester_1 = require('immutable-class-tester');
var data_cube_mock_1 = require('../data-cube/data-cube.mock');
var app_settings_1 = require('./app-settings');
var app_settings_mock_1 = require('./app-settings.mock');
describe('AppSettings', function () {
    var context = app_settings_mock_1.AppSettingsMock.getContext();
    it('is an immutable class', function () {
        immutable_class_tester_1.testImmutableClass(app_settings_1.AppSettings, [
            app_settings_mock_1.AppSettingsMock.wikiOnlyJS(),
            app_settings_mock_1.AppSettingsMock.wikiTwitterJS(),
            app_settings_mock_1.AppSettingsMock.wikiWithLinkViewJS()
        ], { context: context });
    });
    describe("errors", function () {
        it("errors if there is no matching cluster", function () {
            var js = app_settings_mock_1.AppSettingsMock.wikiOnlyJS();
            js.clusters = [];
            chai_1.expect(function () { return app_settings_1.AppSettings.fromJS(js, context); }).to.throw("Can not find cluster 'druid' for data cube 'wiki'");
        });
    });
    describe("back compat", function () {
        it("works with dataSources", function () {
            var oldJS = app_settings_mock_1.AppSettingsMock.wikiOnlyJS();
            oldJS.dataSources = oldJS.dataCubes;
            delete oldJS.dataCubes;
            chai_1.expect(app_settings_1.AppSettings.fromJS(oldJS, context).toJS()).to.deep.equal(app_settings_mock_1.AppSettingsMock.wikiOnlyJS());
        });
        it("deals with old config style", function () {
            var wikiDataCubeJS = data_cube_mock_1.DataCubeMock.WIKI_JS;
            delete wikiDataCubeJS.clusterName;
            wikiDataCubeJS.engine = 'druid';
            var oldJS = {
                customization: {},
                druidHost: '192.168.99.100',
                timeout: 30003,
                sourceListScan: 'auto',
                sourceListRefreshInterval: 10001,
                sourceReintrospectInterval: 10002,
                sourceReintrospectOnLoad: true,
                dataSources: [
                    wikiDataCubeJS
                ]
            };
            chai_1.expect(app_settings_1.AppSettings.fromJS(oldJS, context).toJS().clusters).to.deep.equal([
                {
                    "name": "druid",
                    "type": "druid",
                    "host": "192.168.99.100",
                    "sourceListRefreshInterval": 10001,
                    "sourceListScan": "auto",
                    "sourceReintrospectInterval": 10002,
                    "sourceReintrospectOnLoad": true,
                    "timeout": 30003
                }
            ]);
        });
        it("deals with old config style no sourceListScan=disabled", function () {
            var oldJS = {
                druidHost: '192.168.99.100',
                sourceListScan: 'disable',
                dataSources: [
                    data_cube_mock_1.DataCubeMock.WIKI_JS
                ]
            };
            chai_1.expect(app_settings_1.AppSettings.fromJS(oldJS, context).toJS().clusters).to.deep.equal([
                {
                    "host": "192.168.99.100",
                    "name": "druid",
                    "sourceListScan": "disable",
                    "type": "druid"
                }
            ]);
        });
    });
    describe("general", function () {
        it("blank", function () {
            chai_1.expect(app_settings_1.AppSettings.BLANK.toJS()).to.deep.equal({
                "clusters": [],
                "customization": {},
                "dataCubes": []
            });
        });
        it("converts to client settings", function () {
            var settings = app_settings_mock_1.AppSettingsMock.wikiOnlyWithExecutor();
            chai_1.expect(settings.toClientSettings().toJS()).to.deep.equal({
                "clusters": [
                    {
                        "name": "druid",
                        "type": "druid"
                    }
                ],
                "customization": {
                    "customLogoSvg": "ansvgstring",
                    "headerBackground": "brown",
                    "title": "Hello World"
                },
                "dataCubes": [
                    {
                        "attributes": [
                            {
                                "name": "time",
                                "type": "TIME"
                            },
                            {
                                "name": "articleName",
                                "type": "STRING"
                            },
                            {
                                "name": "page",
                                "type": "STRING"
                            },
                            {
                                "name": "userChars",
                                "type": "SET/STRING"
                            },
                            {
                                "makerAction": {
                                    "action": "count"
                                },
                                "name": "count",
                                "type": "NUMBER",
                                "unsplitable": true
                            }
                        ],
                        "clusterName": "druid",
                        "defaultDuration": "P3D",
                        "defaultFilter": {
                            "op": "literal",
                            "value": true
                        },
                        "defaultPinnedDimensions": [
                            "articleName"
                        ],
                        "defaultSelectedMeasures": [
                            "count"
                        ],
                        "defaultSortMeasure": "count",
                        "defaultTimezone": "Etc/UTC",
                        "description": "Wiki description",
                        "dimensions": [
                            {
                                "formula": "$time",
                                "kind": "time",
                                "name": "time",
                                "title": "Time"
                            },
                            {
                                "formula": "$articleName",
                                "kind": "string",
                                "name": "articleName",
                                "title": "Article Name"
                            },
                            {
                                "formula": "$page",
                                "kind": "string",
                                "name": "page",
                                "title": "Page"
                            },
                            {
                                "formula": "$userChars",
                                "kind": 'string',
                                "name": "userChars",
                                "title": "User Chars"
                            }
                        ],
                        "measures": [
                            {
                                "formula": "$main.sum($count)",
                                "name": "count",
                                "title": "Count"
                            },
                            {
                                "formula": "$main.sum($added)",
                                "name": "added",
                                "title": "Added"
                            }
                        ],
                        "name": "wiki",
                        "refreshRule": {
                            "rule": "fixed",
                            "time": new Date('2016-04-30T12:39:51.350Z')
                        },
                        "source": "wiki",
                        "timeAttribute": "time",
                        "title": "Wiki"
                    }
                ]
            });
        });
    });
});
