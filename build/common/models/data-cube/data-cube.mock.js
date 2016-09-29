"use strict";
var plywood_1 = require('plywood');
var data_cube_1 = require('./data-cube');
var executor = plywood_1.basicExecutorFactory({
    datasets: {
        wiki: plywood_1.Dataset.fromJS([]),
        twitter: plywood_1.Dataset.fromJS([])
    }
});
var DataCubeMock = (function () {
    function DataCubeMock() {
    }
    Object.defineProperty(DataCubeMock, "WIKI_JS", {
        get: function () {
            return {
                name: 'wiki',
                title: 'Wiki',
                description: 'Wiki description',
                clusterName: 'druid',
                source: 'wiki',
                introspection: 'none',
                attributes: [
                    { name: 'time', type: 'TIME' },
                    { name: 'articleName', type: 'STRING' },
                    { name: 'page', type: 'STRING' },
                    { name: 'userChars', type: 'SET/STRING' },
                    { name: 'count', type: 'NUMBER', unsplitable: true, makerAction: { action: 'count' } }
                ],
                dimensions: [
                    {
                        kind: 'time',
                        name: 'time',
                        title: 'Time',
                        formula: '$time'
                    },
                    {
                        kind: 'string',
                        name: 'articleName',
                        title: 'Article Name',
                        formula: '$articleName'
                    },
                    {
                        kind: 'string',
                        name: 'page',
                        title: 'Page',
                        formula: '$page'
                    },
                    {
                        kind: 'string',
                        name: 'userChars',
                        title: 'User Chars',
                        formula: '$userChars'
                    }
                ],
                measures: [
                    {
                        name: 'count',
                        title: 'Count',
                        formula: '$main.sum($count)'
                    },
                    {
                        name: 'added',
                        title: 'Added',
                        formula: '$main.sum($added)'
                    }
                ],
                timeAttribute: 'time',
                defaultTimezone: 'Etc/UTC',
                defaultFilter: { op: 'literal', value: true },
                defaultDuration: 'P3D',
                defaultSortMeasure: 'count',
                defaultPinnedDimensions: ['articleName'],
                defaultSelectedMeasures: ['count'],
                refreshRule: {
                    time: new Date('2016-04-30T12:39:51.350Z'),
                    rule: "fixed"
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataCubeMock, "TWITTER_JS", {
        get: function () {
            return {
                name: 'twitter',
                title: 'Twitter',
                description: 'Twitter description should go here',
                clusterName: 'druid',
                source: 'twitter',
                introspection: 'none',
                dimensions: [
                    {
                        kind: 'time',
                        name: 'time',
                        title: 'Time',
                        formula: '$time'
                    },
                    {
                        kind: 'string',
                        name: 'twitterHandle',
                        title: 'Twitter Handle',
                        formula: '$twitterHandle'
                    },
                    {
                        kind: 'number',
                        name: 'tweetLength',
                        title: 'Tweet Length',
                        formula: '$tweetLength'
                    }
                ],
                measures: [
                    {
                        name: 'count',
                        title: 'count',
                        formula: '$main.count()'
                    }
                ],
                timeAttribute: 'time',
                defaultTimezone: 'Etc/UTC',
                defaultFilter: { op: 'literal', value: true },
                defaultDuration: 'P3D',
                defaultSortMeasure: 'count',
                defaultPinnedDimensions: ['tweet'],
                refreshRule: {
                    rule: "realtime"
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    DataCubeMock.wiki = function () {
        return data_cube_1.DataCube.fromJS(DataCubeMock.WIKI_JS, { executor: executor });
    };
    DataCubeMock.twitter = function () {
        return data_cube_1.DataCube.fromJS(DataCubeMock.TWITTER_JS, { executor: executor });
    };
    return DataCubeMock;
}());
exports.DataCubeMock = DataCubeMock;
