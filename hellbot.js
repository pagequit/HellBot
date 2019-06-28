const fs = require('fs');
const Discord = require('discord.js');

class HellBot {
	constructor(config) {
		this.client = new Discord.Client();
		this.commands = new Discord.Collection();
		this.config = config;

		const commandFiles = fs.readdirSync(this.config.commandsDirectory)
			.filter(file => file.endsWith('.js'))
		;

		for ( const file of commandFiles ) {
			const command = require(`${this.config.commandsDirectory}/${file}`);
			this.commands.set(command.name, command);
		}
	}

	run() {
		this.client.once('ready', () => {
			console.log(`Logged in as: ${this.client.user.tag}`);
		});

		this.client.on('message', message => {
			if ( message.content.startsWith(this.config.prefix) && !message.author.bot ) {
				try {
					this.commands.get(this.parseCommand(message)).execute(message);
				}
				catch (error) {
					console.log(error);
				}
			}
		});

		this.client.login(this.config.token);
	}

	parseCommand(message) {
		return message.content.split(' ', 1)[0].substr(this.config.prefix.length);
	}
}

module.exports = HellBot;