const { Inhibitor } = require('discord-akairo');

class BlacklistInhibitor extends Inhibitor {
    constructor() {
        super('blacklist', {
            reason: 'blacklist'
        })
    }

    exec(message) {
        // He's a meanie!
        // const blacklist = ['81440962496172032'];
        // Pull from sqlite
        return blacklist.includes(message.author.id);
    }
}

module.exports = BlacklistInhibitor;
