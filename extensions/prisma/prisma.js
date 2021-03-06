const { PrismaClient } = require('@prisma/client');

class Prisma extends PrismaClient {
	mount(hellBot) {
		this.guild = hellBot.client.guilds.cache.first();
	}
}

module.exports = Prisma;
