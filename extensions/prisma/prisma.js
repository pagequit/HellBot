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

		const locale = this.hellBot.config.localeFallback;
		
		return await this.user.create({
			data: {
				id: parseInt(id),
				locale: locale,
			},
		});
	}
}

module.exports = Prisma;
