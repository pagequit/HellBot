const { Collection } = require('discord.js');
const HellUserCollection = require('./hellUserCollection');

class Store extends Collection {
    mount(hellBot) {
        this.set('users', new HellUserCollection(hellBot));
        this.set('guild', hellBot.client.guilds.cache.first());
    }
}

module.exports = Store;