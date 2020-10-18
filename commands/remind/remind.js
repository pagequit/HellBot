const Command = require('../../src/command');
const CommandRejection = require('../../src/commandRejection');
const Reminder = require('./entities/reminder');
const { Collection } = require('discord.js');

class Remind extends Command {
	constructor() {
		super();
		this.trigger.push('remind', 'alarm', 'timer', 'erinnermich');
		this.icon = ':alarm_clock:';
		this.info.arguments.push('time');
		this.info.arguments.push('subject');
		this.reminder = new Collection();
	}

	execute(args, message, hellBot) {
		const hellUser = this.$store.get('users')
			.get(message.author.id);

		const mIdx = args.slice(0, 2).findIndex(a => !!parseInt(a));
		if (mIdx === -1) {
			return Promise.reject(new CommandRejection(message, {
				reason: `${this.domain}.noTimeArg`,
			}));
		}

		const minutes = parseInt(args[mIdx]);
		const time = minutes * 60000;
		const subject = !mIdx
			? args[1] ? args[1] : args[0]
			: args[0];

		if (minutes > 1440) {
			return Promise.reject(new CommandRejection(message, {
				reason: `${this.domain}.farTooMuchTime`,
				args: [minutes],
			}));
		}

		if (this.reminder.has(hellUser.id)) {
			return Promise.reject(new CommandRejection(message, {
				reason: `${this.domain}.alreadyInUse`,
				args: [this.reminder.get(hellUser.id).subject],
			}));
		}

		this.reminder.set(hellUser.id, new Reminder({
			subject: subject,
			time: time,
			hellUser: hellUser,
		}));

		const timeout = this.reminder.get(hellUser.id).start(hellBot, this.reminder);

		message.react('❌');

		const filter = (reaction, user) => {
			return reaction.emoji.name === '❌' && user.id === message.author.id;
		};

		message.awaitReactions(filter, { max: 1, time: time })
			.then(collected => {
				clearTimeout(timeout);
				this.reminder.delete(hellUser.id);
			})
			.catch(e => console.error(e))
			.finally(() => {
				// 'message.reactions.removeAll()' won't work on dm channel
				if (message.channel.type !== 'dm') {
					message.reactions.removeAll()
						.catch(e => console.error(e));
				}
			});
	}
}

module.exports = Remind;
