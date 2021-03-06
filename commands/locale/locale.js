const Command = require('../../src/command');

class Locale extends Command {
	constructor() {
		super();
		this.trigger.push('locale', 'language', 'sprache');
		this.icon = ':globe_with_meridians:';
		this.info.arguments.push('locale');
	}

	async execute(args, message) {
		let prismaUser = await this.getPrismaUserByMessage(message);
		let locale = prismaUser.locale;

		if (args.length === 0) {
			message.reply(this.$i18n.t(locale, `${this.domain}.default`, [locale]));
			return;
		}

		const targetLocale = args[0];
		if (this.$i18n.has(targetLocale)) {
			prismaUser = await this.$prisma.user.update({
				where: { id: prismaUser.id },
				data: { locale: targetLocale },
			});
			locale = prismaUser.locale;

			message.reply(this.$i18n.t(locale, `${this.domain}.default`, [locale]));
		}
		else {
			message.reply(this.$i18n.t(locale, `${this.domain}.undefined`, [targetLocale]));
		}
	}
}

module.exports = Locale;
