const { Listener } = require('discord-akairo');
var logger = require('winston');

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            eventName: 'ready'
        });
    }

    exec() {
        logger.info('I\'m ready!');
    }
}

module.exports = ReadyListener;
