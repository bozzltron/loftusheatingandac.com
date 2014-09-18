var entities = require("entities");
var _ = require("underscore");

module.exports.express = {
    customMiddleware: function (app) {

        var express = require('../node_modules/sails/node_modules/express');

        // compression
        app.use(express.compress());
    }
};