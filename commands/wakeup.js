const Command = require('../command');

class WakeUp extends Command {
	constructor(client) {
		super(client);
		this.trigger = ['wakeup', 'wachauf'];
		this.info.description = 'Makes me responsive again.';
		this.icon = '<:alarm_clock:598216094947344388>';
		this.accessLevel = 0;
	}

	execute(args, message) {
		this.client.awake = true;
		message.reply('I\'m back!');
	}
}

module.exports = WakeUp;