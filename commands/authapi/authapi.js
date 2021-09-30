const Command = require('../../src/command');
const CommandRejection = require('../../src/commandRejection');

class AuthAPI extends Command {
	constructor() {
		super();
		this.trigger.push('auth', 'api');
		this.icon = ':receipt:';
		this.accessLevel = 2;
	}

	async execute(args, message, hellBot) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		const url = 'http://localhost:3033/';
		const userId = message.author.id;
		const token = 'abc123';

		message.author.send(`${url}?id=${userId}&token=${token}`);
	}
}

module.exports = AuthAPI;
