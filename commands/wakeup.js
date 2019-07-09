const Command = require('../command');

class WakeUp extends Command {
	constructor(owner) {
		super(owner);
		this.trigger = ['wakeup', 'wachauf'];
		this.info.description = 'Not implemented yet.';
		this.icon = '<:alarm_clock:598216094947344388>';
		this.accessLevel = 0;
	}

	execute(args, message) {
		message.reply('NIY');
	}
}

module.exports = WakeUp;