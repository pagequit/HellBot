const Command = require('../../src/command');

class Ping extends Command {
	constructor() {
		super();
		this.trigger.push('ping');
		this.icon = ':ping_pong:';
	}

	execute(args, message) {
		super.execute(args, message).then(() => {
			const locale = this.commander.locale;
			message.reply(this.$i18n.t(locale, `${this.domain}.pong`));
		});
	}
}

module.exports = Ping;
