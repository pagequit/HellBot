const Command = require('../../src/command');

class FlipACoin extends Command {
	constructor() {
		super();
		this.trigger.push('flipacoin', 'coin', 'münze');
		this.icon = ':coin:';
	}

	execute(args, message) {
		const locale = this.$store.get('users')
			.get(message.author.id).locale;

		const result = {
			0: 'heads',
			1: 'tails',
		}[Math.floor(Math.random() * 2)];

		message.reply(this.$i18n.t(locale, `${this.domain}.${result}`));
	}
}

module.exports = FlipACoin;
