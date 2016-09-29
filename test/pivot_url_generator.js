/** 
 * Pivot URL generator
 *
 * Generates URLs with random parameters to load test Pivot.
 * Needs a JSON config file that specifies some details about
 * the data set that will be queried. The output is a collection
 * of URL strings that follow the pivot query format and use
 * the base64 hashing to compress the query string.
 *
 * Use:
 * node pivot_url_generator.js <path_to_config_file> <number_of_urls_to_generate> <output_folder>
 *
 * Example config:
 * {
 *     "host": "pivot.wikimedia.org",
 *     "dataSet": "Edit History Test",
 *     "minStartTime": "2015-06-01",
 *     "maxEndTime": "2016-09-01",
 *     "granularity": "daily",
 *     "filterDimensions": {
 *         "Event Entity": ["revision", "page", "user"],
 *         "Event Type": ["create", "delete", "rename", "altergroups", "alterblocks", "move"],
 *         "Page Namespace": [0, 1, 2, 3]
 *     },
 *     "breakdownDimensions": [
 *         "Page Title",
 *         "User Text",
 *         "Revision Minor Edit"
 *     ],
 *     "metrics": [
 *         "Deleted Revisions",
 *         "Events",
 *         "Reverted Revisions",
 *         "Reverting Revisions",
 *         "Text Bytes",
 *         "Text Bytes Diff"
 *     ]
 * }
 *
 * Example output:
 * https://pivot.wikimedia.org/#edit-history-test/table/2/EQUQLgxg9AqgKgYWAGgN7APYAdgC5gQAWAhgJYB2KwApgB5YBO1Azs6RpbutnsEwGZVyxALbVeAfQlhSY4AF9kwYhBkdmeANroVazsApU6jFmw55uOfABtSYag2LWqANycBXcV2DMwxBmC8AEwADACMAKwAtGFBUUEAzHBhAOy4QUG4CQCcAHQhBQBaRuQAJsHhAGxRIQkxABzJCVkALLgtEflFCkpgAJ5YXsBwAJIAsiASAEoAggByAOIgCoo6quz6xGVG9EysGxaYVgQkhkrGe2aclrwCQqJD1C7U5GASLzL9Pcrr5t66B3wGGeDGsxBw512pkBNxsdgcTlcHi86GY1DAcAGQwAynApiNFkZrNQxK8NLhNHwnqQrlR3GiGFQsMQAObiAC6imA/UGvGxIDgK3kqx+el4W3KkJM+z+sJOZEoUsuMKOt2ogiUwjk+GZbIkWpYzIg4i5ANlosBmBBYIhNChMuuqrh9kcziUbmsnkOaIxWL5eIJCyJJI+5MpYSoQSoCWAnN6fvw/MFwuFce0dultO8PHwd01DzVLhpGwkIgoGAY71Kdm+zArYBmv0dZv0dYCO0zKpzVI1wANvFK1GJ9lKEiYRauGi51aYTYHLGNZQoLO+tjLDbn/03wDXNaUu8CuAiIVTyHI7ms1iUg+H1FH4+L6hQlPHDhk5BZY+pk6or4Cd6/CcNg0a8h3RACHx/dlkE0aDz0vIA=
 * https://pivot.wikimedia.org/#edit-history-test/table/2/EQUQLgxg9AqgKgYWAGgN7APYAdgC5gQAWAhgJYB2KwApgB5YBO1Azs6RpbutnsEwGZVyxALbVeAfQlhSY4AF9kwYhBkdmeANroVazsApU6jFmw55uOfABtSYag2LWqANycBXcV2DMwxBmC8AEwADACMAKwAtGEhUSEAbHBhAOy4EWHpEQB0IXkAWkbkACbB4QnxYTEpyQm4ACyZIUG5BQpKYACeWF7AcACSALIgEgBKAIIAcgDiIAqKOqrs+sQlRvRMrMsWmFYEJIZKxptmnJa8AkKivdQu1ORgEvcyXe3KS+beutv4GHcM1mIOCOG1MP3ONjsDicrg8XnQzGoYDg3V6AGU4KN+jMjNZqGIHhpcJpgO5EQxgABdRTALo9XhokBwebyBbvPS8ValEEmLafCH7MiUHkncG7C7UQRKYRyfC3Z7SVFvb789k/TD/QHAmigvlncWQ+yOZxKNzWTw7RHIpX4DFYnFHPEEsBEkkQJjEexUER/cRKJxGgDmDAw7iwGmpHRtwEZzNZrMj2h1vNOOx4+Eu0uuvDJDmkdECNOYGAC4w++pV+mLAXWKbF6b4kqusuAxWoePsxQkTBcpFOGhpxVITHLvDbzAg9yH5EDb1sIjsZY5X1HkIXgSU87seAiIQTyHI7ms1iUbY71C7Pb7yw0yBJ9lojwARp17MwJEP+FLG/9O93bte6hUnelIHke1hAA==
 * ...
 */

var ld = require('lodash');
var lz = require('lz-string');
var fs = require('fs');
var df = require('dateformat');

function stringifyArray (elements, insertQuotes) {
    if (insertQuotes) {
        return '["' + elements.join('","') + '"]';
    } else {
        return '[' + elements.join(',') + ']';
    }
}

function instantiate (template, values) {
    return ld.reduce(values, function (formatted, value) {
        return formatted.replace(/{{[^}]*}}/, value);
    }, template);
}


/**
 * Time range template
 *
 * {
 *     "action": "in",
 *     "expression": {
 *         "op": "literal",
 *         "value": {
 *             "start": "{{START_DATE}}",
 *             "end": "{{END_DATE}}"
 *         },
 *         "type": "TIME_RANGE"
 *     }
 * }
 */
var timeRangeTemplate = '{"action":"in","expression":{"op":"literal","value":{"start":"{{START_DATE}}","end":"{{END_DATE}}"},"type":"TIME_RANGE"}}';

/**
 * Filter template
 *
 * {
 *     "action": "and",
 *     "expression": {
 *         "op": "chain",
 *         "expression": {
 *             "op": "ref",
 *             "name": "{{FIELD_NAME}}"
 *         },
 *         "action": {
 *             "action": "overlap",
 *             "expression": {
 *                 "op": "literal",
 *                 "value": {
 *                     "setType": "STRING",
 *                     "elements": {{ARRAY_OF_VALUES}}
 *                 },
 *                 "type":"SET"
 *             }
 *         }
 *     }
 * }
 */
var filterTemplate = '{"action":"and","expression":{"op":"chain","expression":{"op":"ref","name":"{{FIELD_NAME}}"},"action":{"action":"overlap","expression":{"op":"literal","value":{"setType":"STRING","elements":{{ARRAY_OF_VALUES}}},"type":"SET"}}}}';

/**
 * Time-series template
 *
 * {
 *     "expression":{
 *         "op":"ref",
 *         "name":"__time"
 *     },
 *     "bucketAction":{
 *         "action":"timeBucket",
 *         "duration":"P1D"
 *     },
 *     "sortAction":{
 *         "action":"sort",
 *         "expression":{
 *             " op":"ref",
 *             "name":"__time"
 *         },
 *         "direction":"ascending"
 *     }
 * }
 */
var timeSeriesTemplate = '{"expression":{"op":"ref","name":"__time"},"bucketAction":{"action":"timeBucket","duration":"{{granularity}}"},"sortAction":{"action":"sort","expression":{"op":"ref","name":"__time"},"direction":"ascending"}}';

/**
 * Breakdown template
 *
 * {
 *     "expression": {
 *         "op": "ref",
 *         "name": "{{FIELD_NAME}}"
 *     },
 *     "sortAction": {
 *         "action": "sort",
 *         "expression": {
 *             "op": "ref",
 *             "name": "{{FIRST_METRIC}}"
 *         },
 *         "direction": "descending"
 *     },
 *     "limitAction": {
 *         "action": "limit",
 *         "limit": 50
 *     }
 * }
 */
var breakdownTemplate = '{"expression":{"op":"ref","name":"{{FIELD_NAME}}"},"sortAction":{"action":"sort","expression":{"op":"ref","name":"{{FIRST_METRIC}}"},"direction":"descending"},"limitAction":{"action":"limit","limit":10}}';

/**
 * Query template
 *
 * "Etc/UTC",
 * {
 *     "op": "chain",
 *     "expression": {
 *         "op": "ref",
 *         "name": "__time"
 *     },
 *     "actions": {{FILTERS}}
 * },
 * {{BREAKDOWNS}},
 * null,
 * "{{FIRST_METRIC}}",
 * {{SELECTED_METRICS}},
 * [],
 * null
 */
var queryTemplate = '"Etc/UTC",{"op":"chain","expression":{"op":"ref","name":"__time"},"actions":{{FILTERS}}},{{BREAKDOWNS}},null,"{{FIRST_METRIC}}",{{SELECTED_METRICS}},[],null';

function getRandomTimeRange (min, max, size) {
    var range = (max - min);
    var pivotTime, offsetTime;
    if (size === 'short') {
        pivotTime = min + ld.random(0.2, 0.8, true) * range;
        offsetTime = ld.random(0, 0.1, true) * range;
    } else { // size === 'long'
        pivotTime = min + ld.random(0.4, 0.6, true) * range;
        offsetTime = ld.random(0.2, 0.3, true) * range;
    }
    var startTime = new Date(pivotTime - offsetTime);
    var endTime = new Date(pivotTime + offsetTime);
    return [
        // A bit ugly, but didn't want to require the whole moment.js lib.
        df(startTime, 'isoDateTime').substring(0, 19) + '.000Z',
        df(endTime, "isoDateTime").substring(0, 19) + '.000Z'
    ];
}

function generateHash (config, chart, size) {
    // Get time range.
    var timeRange = getRandomTimeRange(
        new Date(config.minStartTime).getTime(),
        new Date(config.maxEndTime).getTime(),
        size
    );
    var timeRangeFilter = instantiate(timeRangeTemplate, timeRange);

    // Get filter.
    var filterDimension = ld.sample(ld.toPairs(config.filterDimensions));
    var field = filterDimension[0], values = filterDimension[1];
    var specifiedValues = ld.sampleSize(values, ld.random(1, 2));
    var dimensionFilter = instantiate(filterTemplate, [ld.snakeCase(field), stringifyArray(specifiedValues, true)]);

    // Get breakdowns.
    var dimensionBreakdowns;
    if (chart === 'totals') {
        dimensionBreakdowns = [];
    } else if (chart === 'time-series') {
        dimensionBreakdowns = [instantiate(timeSeriesTemplate, [config.granularity === 'hourly' ? 'PT1H' : 'P1D'])];
    } else { // chart === 'table'
        var breakdownDimensions = ld.sampleSize(config.breakdownDimensions, 2);
        dimensionBreakdowns = ld.map(breakdownDimensions, function (field) {
            return instantiate(breakdownTemplate, [ld.snakeCase(field), ld.snakeCase(config.metrics[0])]);
        });
    }

    // Put it all together.
    var query = instantiate(queryTemplate, [
        stringifyArray([timeRangeFilter, dimensionFilter]),
        stringifyArray(dimensionBreakdowns),
        ld.snakeCase(config.metrics[0]),
        stringifyArray(ld.map(ld.sampleSize(config.metrics, ld.random(1, 3)), ld.snakeCase), true)
    ]);

    return lz.compressToBase64(query);
}

function generateURLs (config, quantity, chart, size) {
    var hashes = [];
    ld.times(quantity, function () {
        hashes.push(generateHash(config, chart, size));
    });
    return ld.map(hashes, function (hash) {
        return instantiate(
            'https://{{host}}/#{{dataSet}}/{{chart}}/2/{{hash}}',
            [config.host, ld.kebabCase(config.dataSet), chart, hash]
        );
    });
}

function main (configFile, quantity, outputFolder) {
    var config = JSON.parse(fs.readFileSync(configFile));
    ld.forEach(['totals', 'time-series', 'table'], function (chart) {
        ld.forEach(['short', 'long'], function (size) {
            var URLs = generateURLs(config, quantity, chart, size);
            var outputFile = outputFolder + '/' + size + '_' + chart + '.txt';
            fs.writeFileSync(outputFile, URLs.join('\n'));
        });
    });
}

// Use: node pivot_url_generator.js <CONFIG_FILE> <NUMBER_OF_URLS_TO_GENERATE> <OUTPUT_FOLDER>
// Example: node pivot_url_generator.js pivot_config_file.json 100 pivot_urls
main(process.argv[2], process.argv[3], process.argv[4]);
