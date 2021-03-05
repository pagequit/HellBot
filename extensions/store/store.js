const { Collection } = require('discord.js');
const HellUserCollection = require('./hellUserCollection');
const { PrismaClient } = require('@prisma/client');
class Store extends Collection {
	constructor() {
		super();
		this.client = new PrismaClient();;
	}

	mount(hellBot) {
		this.set('users', new HellUserCollection(hellBot));
		this.set('guild', hellBot.client.guilds.cache.first());
	}
}

module.exports = Store;
