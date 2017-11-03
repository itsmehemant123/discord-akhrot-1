const { Command } = require('discord-akairo');
var Client = require('node-rest-client').Client;
var logger = require('winston');
const chatterServer = require('../config/py-server.json')

class TalkCommand extends Command {
    constructor() {
        super('talk', {
          channelRestriction: 'guild',
          trigger: /.*/,
        });
    }

    exec(message) {
      logger.info('TRIGE');
      if (message.channel.type != 'dm') {
        var luck = Math.random() * 100;
        if (message.content.indexOf('wheatley, do you think') >= 0) {
          if (luck > 66) {
            return message.reply('yes bby');
          } else if (luck <= 66 && luck > 33) {
            return message.reply('fuck no my dewd');
          } else {
            return message.reply('idk man');
          }
        } else {

          var trigerred = message.content.toLowerCase().indexOf('wheatley') >= 0;
          if (trigerred || luck > 35) {
            logger.info('TRIGERRED FOR:', message.content)
            message.channel.startTyping();
            this.triggerBot(message, trigerred);
          }
        }

      }
    }

    triggerBot(message, trigerred) {
      var client = new Client();
      var args = {
        data: { message: message.content },
        headers: { "Content-Type": "application/json" }
      };

      client.post('http://' + chatterServer.host + ':' + chatterServer.port + '/respond', args, function(data, response) {
        try {
          var payload = JSON.parse(data);
          message.channel.stopTyping();
          if (trigerred || parseFloat(payload.confidence) > 0.80) {
            logger.info('SENDING');
            return message.channel.send(payload.message).catch(function (err) {
              logger.error('ERROR: ', err);
            });
          }
        } catch (e) {
          message.channel.stopTyping();
          logger.log('ERROR PARSING RECIEVED RESPONSE: ', e);
        }
      });
    }
}

module.exports = TalkCommand;
