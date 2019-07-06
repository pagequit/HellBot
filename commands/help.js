const Command = require('../command');

class Help extends Command {
	constructor(owner) {
		super(owner);
		this.trigger = ['help', 'commands'];
		this.info.description = 'Shows a list of all commands.';
	}

	execute(args, message) {
		if ( args.length === 0 ) {
			this.showCommandList(message.channel);
			return;
		}

		const targetCommand = this.owner.commands
			.find(c => c.constructor.name.toLowerCase() === args[0].toLowerCase())
		;

		const response = targetCommand ? targetCommand.info.description : `I don't know a command like '${args[0]}'.`;

		message.reply(response);
	}

	showCommandList(channel) {
		channel.send(this.owner.commands.map(c => c.constructor.name).join('\n'));
	}
}

module.exports = Help;