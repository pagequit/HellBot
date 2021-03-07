const Command = require('../../src/command');
const CommandRejection = require('../../src/commandRejection');

class Session extends Command {
	constructor() {
		super();
		this.trigger.push('session', 'sitzung');
		this.icon = ':alarm_clock:';
		this.info.arguments.push('stop');
	}

	async execute(args, message, hellBot) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		hellBot.services.get('sessionObserver').init();
	}
}

module.exports = Session;
