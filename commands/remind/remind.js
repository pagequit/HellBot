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

	async execute(args, message, hellBot) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

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

		if (this.reminder.has(prismaUser.id)) {
			return Promise.reject(new CommandRejection(message, {
				reason: `${this.domain}.alreadyInUse`,
				args: [this.reminder.get(prismaUser.id).subject],
			}));
		}

		const guildMember = this.$config.guild.members.cache
			.find(m => m.user.id === message.author.id);

		this.reminder.set(prismaUser.id, new Reminder({
			subject: subject,
			time: time,
			guildMember: guildMember,
			locale: locale,
		}));

		const timeout = this.reminder.get(prismaUser.id).start(hellBot, this.reminder);

		message.react('❌');

		const filter = (reaction, user) => {
			return reaction.emoji.name === '❌' && user.id === message.author.id;
		};

		message.awaitReactions(filter, { max: 1, time: time })
			.then(collected => {
				clearTimeout(timeout);
				this.reminder.delete(prismaUser.id);
			})
			.catch(e => console.error(e))
			.finally(() => {
				if (message.channel.type !== 'dm') {
					message.reactions.removeAll()
						.catch(e => console.error(e));
				}
			});
	}
}

module.exports = Remind;
