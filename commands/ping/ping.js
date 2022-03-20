const Command = require('../../src/command');

class Ping extends Command {
	constructor() {
		super();
		this.trigger.push('ping');
		this.icon = ':ping_pong:';
	}

	async execute(args, message) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		console.log(message);

		message.reply(this.$i18n.t(locale, `${this.domain}.pong`));
	}
}

module.exports = Ping;
