const fs = require('fs');
const Discord = require('discord.js');

class HellBot {
	constructor(config, tokens) {
		this.client = new Discord.Client();
		this.commands = new Discord.Collection();
		this.cooldowns = new Discord.Collection();
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

	handleRejection(message, reason) {
		message.reply(reason);
	}

	logMessage(message) {
		const log = this.guild.channels.find(channel => channel.id === '648781700662296577');
		if (log) {
			log.send(`${message.author.username}: ${message.content}`);
		}
		else {
			console.log(message.author.username, message.content);
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
			this.logMessage(message);
			try {
				this.parseCommand(message)
					.then(commandSet => this.checkPermissions(commandSet))
					.then(commandSet => this.checkCooldowns(commandSet))
					.then(({command, args}) => {
						if ( this.awake || command.constructor.name === 'WakeUp' ) {
							command.execute(args, message);
						}
					})
					.catch(reason => {
						this.handleRejection(message, reason);
					})
				;
			}
			catch (error) {
				console.log(error);
			}
			;
		}
	}

	handleDircetMessage(message) {
		message.reply('I cannot address direct messages so far.');
	}

	parseCommand(message) {
		return new Promise((resolve, reject) => {
			const messageChunks = message.content.split(/ +/);
			const commandStartIndex = messageChunks.findIndex(chunk => chunk === `<@!${this.client.user.id}>`);
			const rawCommand = messageChunks.slice(commandStartIndex + 1);
			const trigger = rawCommand[0] ? rawCommand[0].toLowerCase() : '';

			if ( this.commands.some(command => command.trigger.includes(trigger)) ) {
				resolve({
					command: this.commands.find(command => command.trigger.includes(trigger)),
					commander: message.author,
					args: rawCommand.slice(1),
				});
			}
			else {
				reject('I don\'t understand.');
			}
		});
	}

	checkPermissions(commandSet) {
		return new Promise((resolve, reject) => {
			const member = commandSet.commander.client.guilds.find(guild => guild === this.guild)
				.members.find(member => member.user.username === commandSet.commander.username)
			;

			if ( commandSet.command.accessLevel === null || member.roles.some(role => role.hasPermission('ADMINISTRATOR')) ) {
				resolve(commandSet);
			}
			else {
				let memberHasPermissions = false;
				member.roles.forEach(role => {
					this.config.accessRights.forEach((roleName, accessLevel) => {
						if ( roleName === role.name && accessLevel <= commandSet.command.accessLevel ) {
							memberHasPermissions = true;
						}
					});
				});
				if ( memberHasPermissions ) {
					resolve(commandSet);
				}
				else {
					reject('You can\'t command me that!');
				}
			}
		});
	}

	checkCooldowns(commandSet) {
		const {command, commander} = commandSet;

		return new Promise((resolve, reject) => {
			if ( !this.cooldowns.has(command.constructor.name) ) {
				this.cooldowns.set(command.constructor.name, new Discord.Collection());
			}

			const timestamps = this.cooldowns.get(command.constructor.name);
			let timestamp = timestamps.has(commander.id)
				? timestamps.get(commander.id)
				: 0
			;

			const now = Date.now();
			if ( (timestamp + command.cooldown) <= now ) {
				timestamps.set(commander.id, now)
				resolve(commandSet);
			}
			else {
				reject(`pls wait ${((timestamp + command.cooldown - now) / 1000).toFixed(1)} more seconds...`);
			}
		});
	}

}

module.exports = HellBot;