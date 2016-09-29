"use strict";
var express_1 = require('express');
var router = express_1.Router();
router.post('/', function (req, res) {
    var message = req.body.message;
    if (!message || typeof message !== 'string') {
        res.status(400).send({
            error: 'Error must have a message'
        });
    }
    else {
        console.error("Client Error: " + JSON.stringify(req.body));
        res.send("Error logged @ " + new Date().toISOString());
    }
});
module.exports = router;
