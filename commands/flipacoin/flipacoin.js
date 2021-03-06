const Command = require('../../src/command');

class FlipACoin extends Command {
	constructor() {
		super();
		this.trigger.push('flipacoin', 'coin', 'münze');
		this.icon = ':coin:';
	}

	async execute(args, message) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		const result = {
			0: 'heads',
			1: 'tails',
		}[Math.floor(Math.random() * 2)];

		message.reply(this.$i18n.t(locale, `${this.domain}.${result}`));
	}
}

module.exports = FlipACoin;
