const { Command } = require('discord-akairo');
var Client = require('node-rest-client').Client;
var logger = require('winston');
const chatterServer = require('../config/py-server.json')

class TalkCommand extends Command {
    constructor() {
        super('talk', {
          trigger: /.*/,
        });
    }

    exec(message) {
      var luck = Math.random() * 100;
      if (message.content.toLowerCase().indexOf('wheatley') >= 0 || luck > 35) {
        logger.info('TRIGERRED BY CHANCE FOR:', message.content)
        this.triggerBot(message, (luck > 35));
      }
    }

    triggerBot(message, isLuck) {
      var client = new Client();
      var args = {
        data: { message: message.content },
        headers: { "Content-Type": "application/json" }
      };

      client.post('http://' + chatterServer.host + ':' + chatterServer.port + '/respond', args, function(data, response) {
        var payload = JSON.parse(data);
        if (!isLuck || parseFloat(payload.confidence) > 0.80) {
          logger.info('SENDING')
          return message.channel.send(payload.message).catch(function (err) {
            logger.error('ERROR: ', err)
          });
        }
      });
    }
}

module.exports = TalkCommand;
