const Command = require('../../src/command');

class Debug extends Command {
	constructor() {
		super();
		this.trigger.push('debug');
		this.icon = ':gear:';
		this.accessLevel = 0;
	}

	execute(args, message, hellBot) {
		const hellUser = this.$store.get('users')
			.get(message.author.id);

		const locale = hellUser.locale;

		const channel = this.$store.get('guild')
			.channels.cache.find(c => c.name === 'debug');

		message.author.send(`${args.shift()}, ${args}`).catch(e => {
			message.author.send(`${e}`);
		});
	}

	reload() {

	}

	dumb() {

	}
}

module.exports = Debug;
