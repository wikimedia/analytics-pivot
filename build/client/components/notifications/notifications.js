"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./notifications.css');
var React = require('react');
var index_1 = require('../index');
var notification_card_1 = require('./notification-card');
var Notifier = (function () {
    function Notifier() {
    }
    Notifier.create = function (notification) {
        notification.id = Notifier.counter++;
        Notifier.notifications.push(notification);
        Notifier.callListeners();
        return notification.id;
    };
    Notifier.callListeners = function () {
        Notifier.listeners.forEach(function (cb) { return cb(Notifier.notifications, Notifier.question); });
    };
    Notifier.info = function (title, message) {
        Notifier.create({ title: title, message: message, priority: 'info' });
    };
    Notifier.failure = function (title, message) {
        Notifier.create({ title: title, message: message, priority: 'failure' });
    };
    Notifier.success = function (title, action) {
        Notifier.create({ title: title, priority: 'success', action: action });
    };
    Notifier.subscribe = function (callback) {
        Notifier.listeners.push(callback);
    };
    Notifier.stick = function (text) {
        return Notifier.create({ title: text, priority: 'info', muted: true });
    };
    Notifier.removeSticker = function (id) {
        var notification;
        var index = -1;
        Notifier.notifications.forEach(function (n, i) {
            if (n.id === id) {
                notification = n;
                index = i;
            }
        });
        if (!notification) {
            console.warn('Trying to remove a non existing sticker');
            return;
        }
        notification.discarded = true;
        Notifier.notifications[index] = notification;
        Notifier.callListeners();
    };
    Notifier.ask = function (question) {
        if (Notifier.question)
            throw new Error('There is already a pending question');
        Notifier.question = question;
        Notifier.callListeners();
    };
    Notifier.removeQuestion = function () {
        if (!Notifier.question)
            throw new Error('No question to remove');
        Notifier.question = undefined;
        Notifier.callListeners();
    };
    Notifier.removeNotification = function (notification) {
        var index = Notifier.notifications.indexOf(notification);
        if (index === -1) {
            throw new Error('Trying to remove an unknown notification');
        }
        Notifier.notifications.splice(index, 1);
        Notifier.listeners.forEach(function (cb) { return cb(Notifier.notifications); });
    };
    Notifier.unsubscribe = function (callback) {
        var index = Notifier.listeners.indexOf(callback);
        if (index === -1) {
            throw new Error('Trying to unsubscribe something that never subscribed');
        }
        Notifier.listeners.splice(index, 1);
    };
    Notifier.counter = 0;
    Notifier.notifications = [];
    Notifier.question = null;
    Notifier.listeners = [];
    return Notifier;
}());
exports.Notifier = Notifier;
var Notifications = (function (_super) {
    __extends(Notifications, _super);
    function Notifications() {
        _super.call(this);
        this.state = { notifications: [] };
        this.onChange = this.onChange.bind(this);
    }
    Notifications.prototype.componentDidMount = function () {
        Notifier.subscribe(this.onChange);
    };
    Notifications.prototype.componentWillUnmount = function () {
        Notifier.unsubscribe(this.onChange);
    };
    Notifications.prototype.onChange = function (notifications) {
        this.setState({ notifications: notifications });
    };
    Notifications.prototype.renderCards = function () {
        var cumuledHeight = 13;
        return this.state.notifications.map(function (n, i) {
            var title = n.title, message = n.message, action = n.action;
            var top = cumuledHeight;
            cumuledHeight += [title, message, action].filter(Boolean).length * 30 + 5;
            return React.createElement(notification_card_1.NotificationCard, {model: n, key: n.id, top: top});
        });
    };
    Notifications.prototype.render = function () {
        return React.createElement(index_1.BodyPortal, {left: '50%', top: '10px'}, 
            React.createElement("div", {className: "notifications"}, this.renderCards())
        );
    };
    return Notifications;
}(React.Component));
exports.Notifications = Notifications;
var Questions = (function (_super) {
    __extends(Questions, _super);
    function Questions() {
        _super.call(this);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }
    Questions.prototype.componentDidMount = function () {
        Notifier.subscribe(this.onChange);
    };
    Questions.prototype.componentWillUnmount = function () {
        Notifier.unsubscribe(this.onChange);
    };
    Questions.prototype.onChange = function (notifications, question) {
        this.setState({ question: question });
    };
    Questions.prototype.render = function () {
        var question = this.state.question;
        if (!question)
            return null;
        return React.createElement(index_1.Modal, {className: "remove-modal", title: question.title, onClose: question.onClose}, 
            Array.isArray(question.message)
                ? question.message.map(function (line, i) { return React.createElement("p", {key: i}, line); })
                : React.createElement("p", null, question.message), 
            React.createElement("div", {className: "button-bar"}, question.choices.map(function (_a, i) {
                var label = _a.label, callback = _a.callback, type = _a.type, className = _a.className;
                return React.createElement(index_1.Button, {key: i, className: className, title: label, type: type, onClick: callback});
            })));
    };
    return Questions;
}(React.Component));
exports.Questions = Questions;
