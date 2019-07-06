const Command = require('../command');

class Help extends Command {
	constructor(owner) {
		super(owner);
		this.trigger = ['help', 'commands'];
		this.info.description = 'will help some day';
	}

	execute(args, message) {
		message.channel.send('will help some day');
	}
}

module.exports = Help;