const Command = require('../command');

class Sleep extends Command {
	constructor(owner) {
		super(owner);
		this.trigger = ['sleep', 'schlaf'];
		this.info.description = 'Not implemented yet.';
		this.icon = '<:zzz:597864891579105290>';
		this.accessLevel = 0;
	}

	execute(args, message) {
		message.reply('NIY');
	}
}

module.exports = Sleep;