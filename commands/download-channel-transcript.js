const { Command } = require('discord-akairo');
var Client = require('node-rest-client').Client;
var logger = require('winston');
const chatterServer = require('../config/py-server.json')

class DownloadChannelTranscriptCommand extends Command {
  constructor() {
    super('download-channel-transcript-v1', {
       aliases: ['dwnld'],
       ownerOnly: true,
       args: [
            {
              id: 'limit'
            },
            {
              id: 'channelName',
              match: 'prefix',
              prefix: '--channel=',
              default: 'general',
              type: 'textChannel'
            }
        ]
    });
  }

  exec(message, { limit, channelName }) {
    var client = new Client();
    logger.info('PINGED WITH: ', limit, ' AND CHANNEL: ', channelName.name);
    message.reply('Downloading messages.').then(messageReply => {
      var count = 0;
      if (limit != 'all') {
        this.getMessages(client, messageReply, channelName, parseInt(limit), false, count, null);
      } else {
        this.getMessages(client, messageReply, channelName, limit, true, count, null);
      }

    }).catch(function (er) {
      logger.error('ERROR: ', er)
    });

    return;
  }

  getMessages(rest_client, message, channel, limit, isAll, currentCount, lastMessageId) {
    var condition = {limit: 100 };

    if (lastMessageId != null) {
      condition.before = lastMessageId;
    }

    if (!isAll && currentCount >= limit) {
      message.edit('Finished downloading messages.');
      return currentCount;
    }

    channel.fetchMessages(condition).then(messages => {
      // add to sqlite/mongo
      logger.info('GOT:', messages.size);
      message.edit('Downloaded ' + currentCount + ' messages.');
      this.parseAndSaveMessages(rest_client, messages);
      currentCount += messages.size;
      if (messages.size < 100) {
        message.edit('Finished downloading messages.');
        return currentCount;
      } else {
        return currentCount + this.getMessages(rest_client, message, channel, limit, isAll, currentCount, messages.last().id);
      }
    }).catch(function (e) {
      logger.error('ERROR:', e);
    });
  }

  parseAndSaveMessages(rest_client, messagesList) {
    logger.info('Recieved: ', messagesList.size);
    var isReply = false;
    var args = {
      data: { },
      headers: { "Content-Type": "application/json" }
    };

    var payload = "";

    for (var [key, message] of messagesList.entries()) {
      var parsedMsg = "";
      var splitMsg = message.content.split(' ');
      for (var iter = 0; iter < splitMsg.length; iter++) {
        parsedMsg += splitMsg[iter].replace(/^<@[0-9]{2,}>$/, "") + ' '
      }
      // var msg = message.content.replace(/^<@[0-9]{2,}>$/, "")
      // logger.info('Content: ', parsedMsg, ' created at:', message.createdAt, ' with ID: ', message.id);
      parsedMsg = parsedMsg.replace(/"/g, '\'');
      if (isReply) {
        payload += "  - \"" + parsedMsg + "\"\n";
      } else {
        payload += "- - \"" + parsedMsg + "\"\n";
      }
      isReply = !isReply;
    }

    args.data.message = payload;
    logger.info('POSTING TO ', chatterServer.host + ':' + chatterServer.port + '/write')
    rest_client.post('http://' + chatterServer.host + ':' + chatterServer.port + '/write', args, function(data, response) {

    });
  }

}

module.exports = DownloadChannelTranscriptCommand;
