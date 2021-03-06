const Command = require('../../src/command');
const { MessageEmbed } = require('discord.js');

class Help extends Command {
	constructor() {
		super();
		this.trigger.push('help', 'hilfe');
		this.icon = ':angel:';
		this.info.arguments.push('command');
	}

	async execute(args, message, { commands }) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		if (args.length === 0) {
			const embed = new MessageEmbed();
			embed.setColor(this.accessColor);
			commands.forEach(c => {
				const title = `${c.icon} ${c.name}`;
				let description = `${this.$i18n.t(locale, c.info.description)}\n`;
				description += `${this.$i18n.t(locale, 'embed.trigger')}: ${c.trigger.join(', ')}`;
				embed.addField(title, description);
			});

			message.reply(this.$i18n.t(locale, `${this.domain}.default`), { embed: embed });
			return;
		}

		const targetCommand = commands
			.find(c => c.name.toLowerCase() === args[0].toLowerCase() ||
			c.trigger.includes(args[0].toLowerCase()));

		if (targetCommand) {
			message.reply({ embed: targetCommand.toEmbed(locale) });
		}
		else {
			message.reply(this.$i18n.t(locale, `${this.domain}.undefined`, [args[0]]));
		}
	}
}

module.exports = Help;
