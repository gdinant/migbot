'use strict';

var express = require('express');
var app = express();

var bot = require('./bot');
bot.setup(app);

app.listen(process.env.PORT || 3333, function() {
    console.log('App started listening on port 3333');
});