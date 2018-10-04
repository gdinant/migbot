'use strict';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports.setup = function(app) {
    var builder = require('botbuilder');
    var teams = require('botbuilder-teams');
    var config = require('config');
    var Sugar = require('sugar');
    var botConfig = config.get('bot');
    
    var connector = new teams.TeamsChatConnector({
        appId: process.env.MICROSOFT_APP_ID || botConfig.microsoftAppId,
        appPassword: process.env.MICROSOFT_APP_PASSWORD || botConfig.microsoftAppPassword
    });
    
    var inMemoryStorage = new builder.MemoryBotStorage();
    var bot = new builder.UniversalBot(connector, function(session) {
        var params = teams.TeamsMessage.getTextWithoutMentions(session.message).replaceAll("[^a-zA-Z]", "_");
        var now = Sugar.Date.format(new Date(), '{yyyy}{MM}{dd}{hh}{mm}{ss}');
        var scriptName = now + "__" + params + ".sql";
        session.send(scriptName);
    }).set('storage', inMemoryStorage);

    app.post('/api/messages', connector.listen());
    module.exports.connector = connector;
};
