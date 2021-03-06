const fs = require('fs');
const Discord = require('discord.js');
const CommandRejection = require('./commandRejection');
const Command = require('./command');
const Task = require('./task');

function HellBot(config) {
	this.config = config;
	this.client = new Discord.Client();
	this.ext = new Object();
	this.commands = new Discord.Collection();
	this.tasks = new Discord.Collection();

	assigneExtensions.call(this, process.env.APP_ROOT + config.extensionsDirectory);
	assignCommands.call(this, process.env.APP_ROOT + config.commandsDirectory);
	assignTasks.call(this, process.env.APP_ROOT + config.tasksDirectory);

	Command.prototype.$config = this.config;
	Task.prototype.$config = this.config;
}

function assigneExtensions(extensionsDirectory) {
	const extensionNames = fs.readdirSync(extensionsDirectory);

	for (const name of extensionNames) {
		const Extension = require(`${extensionsDirectory}/${name}/${name}.js`);
		const extension = new Extension();
		Command.prototype[`$${name}`] = extension;
		Task.prototype[`$${name}`] = extension;
		this.ext[name] = extension;
	}
}

function assignTasks(tasksDirectory) {
	const taskNames = fs.readdirSync(tasksDirectory);

	for (const name of taskNames) {
		const Task = require(`${tasksDirectory}/${name}/${name}.js`);
		const task = new Task();
		this.tasks.set(name, task);
	}
}

function mountExtensions(hellBot) {
	for (const name in hellBot.ext) {
		hellBot.ext[name].mount(hellBot);
	}
}

function handleMessage(message) {
	if (message.author.bot) {
		return;
	}

	if (message.mentions.has(this.client.user) || message.channel.type === 'dm') {
		parseCommand.call(this, message)
			.then(fetchGuildMember.bind(this))
			.then(checkPermissions.bind(this))
			.then(({ command, args }) => {
				return command.execute(args, message, this);
			})
			.catch(rejection => {
				if (rejection.handle) {
					rejection.handle(this);
				}
				else {
					console.error(rejection);
				}
			})
		;
	}
}

async function fetchGuildMember({ command, args, message }) {
	const guildMember = await this.ext.guild.members
		.fetch({ user: message.author });

	return ({ command, args, message, guildMember });
}

function checkPermissions({ command, args, message, guildMember }) {
	if (guildMember.hasPermission('ADMINISTRATOR')) {
		return Promise.resolve({ command, args, message });
	}

	const now = Date.now();
	if (
		!command.timestamps.has(guildMember.id) ||
		now > command.timestamps.get(guildMember.id) + command.cooldown
	) {
		const hasPermissions = command.accessLevel === null || guildMember.roles.cache.some(role => {
			return this.config.accessRights.some((roleName, accessLevel) => {
				return roleName === role.name && accessLevel <= command.accessLevel;
			});
		});
		if (hasPermissions) {
			command.timestamps.set(guildMember.id, now);
			return Promise.resolve({ command, args, message });
		}
		return Promise.reject(new CommandRejection(message, {
			reason: 'commandRejection.permission',
			args: [this.config.accessRights[command.accessLevel]],
		}));
	}
	else {
		return Promise.reject(new CommandRejection(message, {
			reason: 'commandRejection.cooldown',
			args: [Math.ceil((command.timestamps.get(guildMember.id) + command.cooldown - now) / 1000)],
		}));
	}
}

function parseCommand(message) {
	const messageChunks = message.content.split(/ +/);
	const regex = new RegExp(`<@!?${this.client.user.id}>`);
	const commandStartIndex = messageChunks.findIndex(chunk => regex.test(chunk));
	const rawCommand = messageChunks.slice(commandStartIndex + 1);
	const trigger = rawCommand[0] ? rawCommand[0].toLowerCase() : '';
	const command = this.commands.find(c => c.trigger.includes(trigger));
	const args = rawCommand.slice(1);

	return new Promise((resolve, reject) => {
		if (command) {
			resolve({ command, args, message });
		}
		else {
			reject(new CommandRejection(message, {
				reason: 'commandRejection.undefined',
				args: [trigger],
			}));
		}
	});
}

function assignCommands(commandsDirectory) {
	const commandNames = fs.readdirSync(commandsDirectory);

	for (const name of commandNames) {
		const Command = require(`${commandsDirectory}/${name}/${name}.js`);
		const command = new Command();
		this.commands.set(command.domain, command);
	}
}

function runTasks(hellBot) {
	if (process.env.APP_CONTEXT === 'prod') {
		hellBot.tasks.forEach(t => {
			t.run(hellBot);
		});
	}
}

function ready() {
	mountExtensions(this);
	runTasks(this);

	console.log(`Logged in as: ${this.client.user.tag}`);
}

HellBot.prototype.run = function () {
	this.client.once('ready', ready.bind(this));
	this.client.on('message', handleMessage.bind(this));
	this.client.login(process.env.DISCORD_KEY);
}

module.exports = HellBot;
