const Command = require('../../src/command');

class Ping extends Command {
	constructor() {
		super();
		this.trigger.push('ping');
		this.icon = ':ping_pong:';
	}

	async execute(args, message) {
		const locale = await this.getCommander(message).locale;
		message.reply(this.$i18n.t(locale, `${this.domain}.pong`));
	}
}

module.exports = Ping;
