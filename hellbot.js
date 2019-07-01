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
			this.handleMessage(message);
		});

		this.client.login(this.config.token);
	}

	handleMessage(message) {
		if ( message.author.bot ) {
			return;
		}

		if ( message.channel.type === 'dm' ) {
			this.handleDircetMessage(message);
			return;
		}

		if ( message.isMentioned(this.client.user) ) {
			const { command, args } = this.parseCommand(message);
			try {
				command.execute(args, message);
			}
			catch (error) {
				console.log(error);
			}
		}
	}

	handleDircetMessage(message) {
		message.reply('I cannot address direct messages so far.');
	}

	parseCommand(message) {
		const messageChunks = message.content.split(/ +/);
		const commandStartIndex = messageChunks.findIndex(chunk => chunk === `<@${this.client.user.id}>`);
		const rawCommand = messageChunks.slice(commandStartIndex + 1);
		const commandName = rawCommand[0] ? rawCommand[0].toLowerCase() : '';

		if ( this.commands.some(command => commandName === command.name) ) {
			return {
				command: this.commands.get(commandName),
				args: rawCommand.slice(1),
			};
		}

		return {
			command: { execute: (args, message) => { message.reply('I don\'t understand.'); } },
		};
	}
}

module.exports = HellBot;