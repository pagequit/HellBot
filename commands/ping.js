const Command = require('../command');

class Ping extends Command {
	constructor(owner) {
		super(owner);
		this.trigger = ['ping'];
		this.info.description = 'Replies with \'pong\'.';
		this.icon = '<:ping_pong:597524649924100126>';
	}

	execute(args, message) {
		message.reply('pong');
	}
}

module.exports = Ping;