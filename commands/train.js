const { Command } = require('discord-akairo');
var Client = require('node-rest-client').Client;
var logger = require('winston');
const chatterServer = require('../config/py-server.json')

class TrainCommand extends Command {
    constructor() {
        super('train', {
          ownerOnly: true,
          aliases: ['train'],
        });
    }

    exec(message) {
      var client = new Client();

      client.get('http://' + chatterServer.host + ':' + chatterServer.port + '/train', function(data, response) {
        logger.info('TRAIN:', data)
      });

      return message.reply('Issued the train command');
    }
}

module.exports = TrainCommand;
