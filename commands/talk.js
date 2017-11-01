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
      if (message.content.indexOf('akhrot') >= 0)
      {
        logger.info('TRIGERRED FOR:', message.content)
        this.triggerBot(message);
      } else {
        var luck = Math.random() * 100;
        if (luck > 98) {
          logger.info('TRIGERRED BY CHANCE FOR:', message.content)
          this.triggerBot(message);
        }
      }
    }

    triggerBot(message) {
      var client = new Client();
      var args = {
        data: { message: message.content },
        headers: { "Content-Type": "application/json" }
      };

      client.post('http://' + chatterServer.host + ':' + chatterServer.port + '/respond', args, function(data, response) {
        return message.reply(JSON.parse(data).message).catch(function (err) {
          logger.error('ERROR: ', err)
        });
      });
    }
}

module.exports = TalkCommand;
