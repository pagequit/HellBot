const { PrismaClient } = require('@prisma/client');

class Prisma extends PrismaClient {
	mount(hellBot) {
		this.hellBot = hellBot;
	}

	async getPrismaUserById(id) {
		const prismaUser = await this.user.findUnique({
			where: {
				id: parseInt(id),
			},
		});

		if (prismaUser) {
			return prismaUser;
		}

		const guildMember = this.hellBot.client.guilds.cache.first()
			.members.cache.find(m => m.user.id === id);

		const locale = guildMember.user.locale || this.hellBot.config.localeFallback;
		
		return await this.user.create({
			data: {
				id: parseInt(id),
				locale: locale,
			},
		});
	}
}

module.exports = Prisma;
