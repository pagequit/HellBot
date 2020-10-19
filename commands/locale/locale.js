const Command = require('../../src/command');

class Locale extends Command {
	constructor() {
		super();
		this.trigger.push('locale', 'language', 'sprache');
		this.icon = ':globe_with_meridians:';
		this.info.arguments.push('locale');
	}

	execute(args, message) {
		const hellUser = this.$store.get('users')
			.get(message.author.id);

		let locale = hellUser.locale;
		const targetLocale = args[0];

		if (args.length === 0) {
			message.reply(this.$i18n.t(locale, `${this.domain}.default`, [locale]));
			return;
		}

		if (this.$i18n.has(targetLocale)) {
			hellUser.locale = targetLocale
			locale = hellUser.locale;
			message.reply(this.$i18n.t(locale, `${this.domain}.default`, [locale]));
		}
		else {
			message.reply(this.$i18n.t(locale, `${this.domain}.undefined`, [targetLocale]));
		}
	}
}

module.exports = Locale;
