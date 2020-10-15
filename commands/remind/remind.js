const { DiscordAPIError } = require('discord.js');
const Command = require('../../src/command');
const { Collection } = require('discord.js');
const Reminder = require('./entity/reminder');

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

		if (args.length < 2) {
			message.reply(`I need a subject and a termin in order to remind you.`);
			return;
		}

		const subject = args[0];
		const minutes = args[1];

		if (this.reminder.some(hellUser.id)) {
			message.reply(`I should remind you already to ${this.reminder.get(hellUser.id).title}`);
		}
		else {
			this.reminder.set(hellUser.id, new Reminder({
				subject: subject,
				minutes: minutes,
				hellUser: hellUser,
			}));
		}

	}
}

module.exports = Remind;
