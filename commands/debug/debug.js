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

		const commandChunks = args.shift().split(/:/);
		const command = commandChunks[0];
		const mod = commandChunks[1];

		if (typeof this[command] === 'function') {
			try {
				this[command](mod, args, message, hellBot);
			}
			catch (error) {
				console.error(error);
				message.author.send(`${error}`).catch(e => {
					console.error(e);
				});
			}
		}
	}

	reload(mod, args, message, hellBot) {
		return;
	}

	dump(mod, args, message, hellBot) {
		const target = args.reduce((acc, cur) => {
			return acc[cur];
		}, hellBot);

		let dived = mod !== 'deep';
		function replacer(key, value) {
			if (!!key && typeof value === 'object') {
				if (dived) {
					dived = mod !== 'deep';
					return `${value}`;
				}
				dived = true;
			}
			return value;
		}

		const result = JSON.stringify(target, replacer, 2);

		message.author.send(result).catch(e => {
			console.error(e);
			message.author.send(`${e}`);
		});
	}
}

module.exports = Debug;
