/*
const { Command } = require('discord-akairo');
var Client = require('node-rest-client').Client;
var logger = require('winston');
const chatterServer = require('../config/py-server.json')

class TalkCommand extends Command {
    constructor() {
        super('talk', {
          trigger: /he/
        });
    }

    exec(message) {
      var client = new Client();
      var args = {
        data: { message: message.content },
        headers: { "Content-Type": "application/json" }
      };

      client.post('http://' + chatterServer.host + ':' + chatterServer.port + '/respond', args, function(data, response) {
        return message.reply(JSON.parse(data).message);
      });
    }
}

module.exports = TalkCommand;
*/
