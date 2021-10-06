const Command = require('../../src/command');
const TokenGen = require('./entities/tokenGen');
const crypto = require('crypto');

class AuthAPI extends Command {
	constructor() {
		super();
		this.trigger.push('auth', 'api');
		this.icon = ':receipt:';
		this.accessLevel = 2;
		this.tokenGen = new TokenGen();
	}

	async execute(args, message, hellBot) {
		let prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const access_token = this.tokenGen.getToken();

		const tokenHash = crypto.createHmac('sha256', process.env.API_SECRET)
			.update(access_token)
			.digest('hex');

		prismaUser = await this.$prisma.user.update({
			where: { id: prismaUser.id },
			data: { access_token: tokenHash },
		});

		message.author.send(`access_token: ${access_token}`);
	}
}

module.exports = AuthAPI;
