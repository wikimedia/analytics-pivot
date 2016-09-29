"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require('./notification-card.css');
var React = require('react');
var dom_1 = require('../../utils/dom/dom');
var notifications_1 = require('./notifications');
var DEFAULT_DURATION = 6;
var NotificationCard = (function (_super) {
    __extends(NotificationCard, _super);
    function NotificationCard() {
        _super.call(this);
        this.state = {
            appearing: false,
            disappearing: false,
            hovered: false,
            timerExpired: false
        };
    }
    NotificationCard.prototype.componentDidMount = function () {
        var _this = this;
        this.setState({ appearing: true }, function () {
            _this.timeoutID = window.setTimeout(_this.appear.bind(_this), 10);
        });
    };
    NotificationCard.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.model && nextProps.model.discarded) {
            this.disappear();
        }
    };
    NotificationCard.prototype.appear = function () {
        var _this = this;
        var _a = this.props.model, title = _a.title, message = _a.message, duration = _a.duration, muted = _a.muted;
        var d = dom_1.clamp(duration, -1, 10);
        if (d === -1) {
            this.setState({ appearing: false });
            return;
        }
        if (muted) {
            this.setState({ appearing: false });
        }
        else {
            this.setState({ appearing: false }, function () {
                _this.timeoutID = window.setTimeout(_this.onDisappearTimerEnd.bind(_this), (d ? d : DEFAULT_DURATION) * 1000);
            });
        }
    };
    NotificationCard.prototype.onDisappearTimerEnd = function () {
        if (this.state.hovered) {
            this.setState({
                timerExpired: true
            });
            return;
        }
        this.disappear();
    };
    NotificationCard.prototype.disappear = function () {
        var _this = this;
        if (this.timeoutID !== undefined)
            window.clearTimeout(this.timeoutID);
        this.setState({ disappearing: true }, function () {
            _this.timeoutID = window.setTimeout(_this.removeMe.bind(_this, _this.props.model), 200);
        });
    };
    NotificationCard.prototype.removeMe = function (notification) {
        if (this.timeoutID !== undefined)
            window.clearTimeout(this.timeoutID);
        notifications_1.Notifier.removeNotification(notification);
    };
    NotificationCard.prototype.componentWillUnmount = function () {
        if (this.timeoutID !== undefined)
            window.clearTimeout(this.timeoutID);
    };
    NotificationCard.prototype.onMouseOver = function () {
        this.setState({
            hovered: true
        });
    };
    NotificationCard.prototype.onMouseLeave = function () {
        this.setState({
            hovered: false
        });
        if (this.state.timerExpired) {
            this.disappear();
        }
    };
    NotificationCard.prototype.render = function () {
        var _this = this;
        var _a = this.state, appearing = _a.appearing, disappearing = _a.disappearing;
        var _b = this.props, model = _b.model, top = _b.top;
        if (!model)
            return null;
        var title = model.title, message = model.message, priority = model.priority, action = model.action, muted = model.muted;
        if (appearing || disappearing)
            top = -100;
        var rowsClass = "rows-" + [title, message, action].filter(Boolean).length;
        var onClick = function () {
            action && action.callback();
            _this.disappear();
        };
        return React.createElement("div", {style: { top: top }, onClick: onClick, onMouseOver: this.onMouseOver.bind(this), onMouseLeave: this.onMouseLeave.bind(this), className: dom_1.classNames("notification-card " + priority + " " + rowsClass, { appearing: appearing, disappearing: disappearing, muted: muted })}, 
            React.createElement("div", {className: "title"}, title), 
            message ? React.createElement("div", {className: "message"}, message) : null, 
            action ? React.createElement("div", {className: "action"}, 
                React.createElement("span", null, action.label)
            ) : null);
    };
    return NotificationCard;
}(React.Component));
exports.NotificationCard = NotificationCard;
