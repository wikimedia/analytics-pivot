"use strict";
var Qajax = require('qajax');
var plywood_1 = require('plywood');
Qajax.defaults.timeout = 0;
function getSplitsDescription(ex) {
    var splits = [];
    ex.forEach(function (ex) {
        if (ex instanceof plywood_1.ChainExpression) {
            ex.actions.forEach(function (action) {
                if (action instanceof plywood_1.SplitAction) {
                    splits.push(action.firstSplitExpression().toString());
                }
            });
        }
    });
    return splits.join(';');
}
var reloadRequested = false;
function reload() {
    if (reloadRequested)
        return;
    reloadRequested = true;
    window.location.reload(true);
}
function parseOrNull(json) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        return null;
    }
}
var Ajax = (function () {
    function Ajax() {
    }
    Ajax.query = function (options) {
        var data = options.data;
        if (data) {
            if (Ajax.version)
                data.version = Ajax.version;
            if (Ajax.settingsVersionGetter)
                data.settingsVersion = Ajax.settingsVersionGetter();
        }
        return Qajax({
            method: options.method,
            url: options.url,
            data: data
        })
            .timeout(60000)
            .then(Qajax.filterSuccess)
            .then(Qajax.toJSON)
            .then(function (res) {
            if (res && res.action === 'update' && Ajax.onUpdate)
                Ajax.onUpdate();
            return res;
        })
            .catch(function (xhr) {
            if (!xhr)
                return null;
            if (xhr instanceof Error) {
                throw new Error('client timeout');
            }
            else {
                var jsonError = parseOrNull(xhr.responseText);
                if (jsonError) {
                    if (jsonError.action === 'reload') {
                        reload();
                    }
                    else if (jsonError.action === 'update' && Ajax.onUpdate) {
                        Ajax.onUpdate();
                    }
                    throw new Error(jsonError.message || jsonError.error);
                }
                else {
                    throw new Error(xhr.responseText || 'connection fail');
                }
            }
        });
    };
    Ajax.queryUrlExecutorFactory = function (name, url) {
        return function (ex, env) {
            if (env === void 0) { env = {}; }
            return Ajax.query({
                method: "POST",
                url: url + '?by=' + getSplitsDescription(ex),
                data: {
                    dataCube: name,
                    expression: ex.toJS(),
                    timezone: env ? env.timezone : null
                }
            }).then(function (res) { return plywood_1.Dataset.fromJS(res.result); });
        };
    };
    return Ajax;
}());
exports.Ajax = Ajax;
