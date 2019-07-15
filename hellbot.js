const fs = require('fs');
const Discord = require('discord.js');

class HellBot {
	constructor(config, tokens) {
		this.client = new Discord.Client();
		this.commands = new Discord.Collection();
		this.config = config;
		this.tokens = tokens;
		this.guild = null;
		this.awake = true;

		this.assignAccessRights(config);
		this.assignCommands(config);
	}

	run() {
		this.client.once('ready', this.getReady.bind(this));
		this.client.on('message', this.handleMessage.bind(this));
		this.client.login(this.tokens.discord);
	}

	getReady() {
		this.guild = this.client.guilds.find(guild => guild.name === this.config.guild);
		console.log(`Logged in as: ${this.client.user.tag}`);
	}

	assignAccessRights(config) {
		const accessRights = new Discord.Collection();
		for ( const accessLevel in config.accessRights ) {
			accessRights.set(parseInt(accessLevel), config.accessRights[accessLevel]);
		}

		this.config.accessRights = accessRights;
	}

	assignCommands(config) {
		const commandFiles = fs.readdirSync(config.commandsDirectory)
			.filter(file => file.endsWith('.js'))
		;

		for ( const file of commandFiles ) {
			const commandClass = require(`${config.commandsDirectory}/${file}`);
			const command = new commandClass(this);

			this.commands.set(command.constructor.name.toLowerCase(), command);
		}
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

			if ( this.awake || command.constructor.name === 'WakeUp' ) {
				if ( command.isNotPermittedFor(message.author) ) {
					message.reply('You can\'t command that to me!');
					return;
				}
				try {
					command.execute(args, message);
				}
				catch (error) {
					console.log(error);
				}
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