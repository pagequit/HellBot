const Command = require('../../src/command');

class Help extends Command {
    constructor(hellbot) {
        super(hellbot);
        this.trigger.push('help', 'hilfe');
        this.icon = ':angel:';
        this.info.arguments.push('command');
    }

    execute(args, message, { commands }) {
        const locale = this.$store.get('users')
            .get(message.author.id).locale
        ;

        if (args.length === 0) {
			message.reply(this.$i18n.t(locale, `${this.domain}.default`));
			return;
		}

		const targetCommand = commands
			.find(c => c.name.toLowerCase() === args[0].toLowerCase() || c.trigger.includes(args[0].toLowerCase()))
		;
		if (targetCommand) {
			message.channel.send({ embed: targetCommand.toEmbed() });
		}
		else {
			message.reply(this.$i18n.t(locale, `${this.domain}.undefined`, [args[0]]));
		}
    }
}

module.exports = Help;