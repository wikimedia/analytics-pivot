"use strict";
var Device = (function () {
    function Device() {
    }
    Device.getSize = function () {
        if (window.innerWidth <= 1080)
            return 'small';
        if (window.innerWidth <= 1250)
            return 'medium';
        return 'large';
    };
    return Device;
}());
exports.Device = Device;
