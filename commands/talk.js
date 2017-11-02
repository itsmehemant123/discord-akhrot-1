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
      // if (message.content.toLowerCase().indexOf('wheatley') >= 0)
      // {
      //   logger.info('TRIGERRED FOR:', message.content)
      //   this.triggerBot(message);
      // } else {
      //   var luck = Math.random() * 100;
      //   if (luck > 98) {
      //     logger.info('TRIGERRED BY CHANCE FOR:', message.content)
      //     this.triggerBot(message);
      //   }
      // }
      this.triggerBot(message);
    }

    triggerBot(message) {
      var client = new Client();
      var args = {
        data: { message: message.content },
        headers: { "Content-Type": "application/json" }
      };

      client.post('http://' + chatterServer.host + ':' + chatterServer.port + '/respond', args, function(data, response) {
        var payload = JSON.parse(data);
        if (message.content.toLowerCase().indexOf('wheatley') >= 0 || parseFloat(payload.confidence) > 0.65) {
          logger.info('SENDING')
          return message.channel.send(payload.message).catch(function (err) {
            logger.error('ERROR: ', err)
          });
        }
      });
    }
}

module.exports = TalkCommand;
