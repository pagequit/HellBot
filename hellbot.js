const Discord = require('discord.js');
const { ping, sleep, wakeup } = require('./commands.js');

class HellBot {
	constructor(config) {
		this.client = new Discord.Client();
		this.config = this.parseConfig(config);
		this.command = {
			ping: ping,
			sleep: sleep,
			wakeup: wakeup,
		};
	}

	run() {
		this.client.once('ready', () => {
			console.log(`Logged in as: ${this.client.user.tag}`);
		});

		this.client.on('message', message => {
			if ( message.content.startsWith(this.config.prefix) && !message.author.bot ) {
				try {
					this.command[this.parseCommand(message)](message);
				}
				catch (error) {
					console.log(error);
				}
			}
		});

		this.client.login(this.config.token);
	}

	parseConfig(config) {
		return {
			prefix: config.prefix,
			token: config.token,
		};
	}

	parseCommand(message) {
		return message.content.split(' ', 1)[0].substr(this.config.prefix.length);
	}

	registerCommand(name, callback) {
		if ( this.command[name] !== undefined ) {
			throw new Error(`Command: '${name}', already exists!`);
		}

		this.command[name] = callback;
	}
}

module.exports = HellBot;