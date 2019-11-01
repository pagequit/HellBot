const Command = require('../command');

class Help extends Command {
	constructor(client) {
		super(client);
		this.trigger = ['help', 'hilfe'];
		this.info.arguments = 'optional';
		this.info.description = 'Shows a list with all commands.';
		this.icon = '<:angel:597524236810321931>';
	}

	execute(args, message) {
		if ( args.length === 0 ) {
			message.reply('here is a list of all my commands:')
				.then(() => this.showCommandList(message.channel))
			;

			return;
		}

		const targetCommand = this.client.commands
			.find(c => c.constructor.name.toLowerCase() === args[0].toLowerCase())
		;

		if ( targetCommand ) {
			message.channel.send({ embed: targetCommand.toEmbed() });
		}
		else {
			message.reply(`I don't know a command named '${args[0]}'.`);
		}
	}

	showCommandList(channel) {
		this.client.commands.forEach(command => {
			channel.send({ embed: command.toEmbed() });
		});
	}
}

module.exports = Help;