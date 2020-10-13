const { DiscordAPIError } = require('discord.js');
const Command = require('../../src/command');
const { Collection } = require('discord.js');


class Remind extends Command {
	constructor() {
		super();
		this.trigger.push('remind', 'alarm', 'erinnermich');
		this.icon = ':alarm:';
		this.accessLevel = 0;
		this.reminder = new Collection();
	}

	execute(args, message, hellBot) {
		const hellUser = this.$store.get('users')
			.get(message.author.id);

		const locale = hellUser.locale;

		if (this.reminder.some(hellUser.id)) {
			message.reply(`I should remind you already to ${this.reminder.get(hellUser.id).title}`);
		}

	}
}

module.exports = Remind;
