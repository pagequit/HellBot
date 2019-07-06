const Command = require('../command');

class Ping extends Command {
	constructor(owner) {
		super(owner);
		this.trigger = ['ping'];
	}

	execute(args, message) {
		message.channel.send('pong');
	}
}

module.exports = Ping;