const fs = require('fs');
const Discord = require('discord.js');

class HellBot {
	constructor(config, tokens) {
		this.client = new Discord.Client();
		this.commands = new Discord.Collection();
		this.config = config;
		this.tokens = tokens;
		this.guild = null;

		const accessRights = new Discord.Collection();
		for ( const accessLevel in config.accessRights ) {
			accessRights.set(parseInt(accessLevel), config.accessRights[accessLevel]);
		}
		this.config.accessRights = accessRights;
	}

	run() {
		this.client.once('ready', () => {
			this.guild = this.client.guilds.find(guild => guild.name === 'HellNet');

			const commandFiles = fs.readdirSync(this.config.commandsDirectory)
				.filter(file => file.endsWith('.js'))
			;

			for ( const file of commandFiles ) {
				const commandClass = require(`${this.config.commandsDirectory}/${file}`);
				const command = new commandClass(this);

				this.commands.set(command.constructor.name.toLowerCase(), command);
			}

			this.client.on('message', message => {
				this.handleMessage(message);
			});

			console.log(`Logged in as: ${this.client.user.tag}`);
		});

		this.client.login(this.tokens.discord);
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
		const trigger = rawCommand[0] ? rawCommand[0].toLowerCase() : '';

		if ( this.commands.some(command => command.trigger.includes(trigger)) ) {
			return {
				command: this.commands.find(command => command.trigger.includes(trigger)),
				args: rawCommand.slice(1),
			};
		}

		return {
			command: { execute: (args, message) => { message.reply('I don\'t understand.'); } },
		};
	}
}

module.exports = HellBot;