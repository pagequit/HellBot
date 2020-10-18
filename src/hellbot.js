const fs = require('fs');
const Discord = require('discord.js');
const CommandRejection = require('./commandRejection');
const Command = require('./command');
const Task = require('./task');

function HellBot(config, tokens, root) {
	this.config = config;
	this.config.tokens = tokens;
	this.config.root = root;
	this.client = new Discord.Client();
	this.ext = new Object();
	this.commands = new Discord.Collection();
	this.tasks = new Discord.Collection();

	assigneExtensions.call(this, root + config.extensionsDirectory);
	assignCommands.call(this, root + config.commandsDirectory);
	assignTasks.call(this, root + config.tasksDirectory);
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

function checkPermissions({ command, args, message }) {
	const commander = this.client.guilds.cache.first().members.cache
		.find(m => m.user.id === message.author.id)
	;

	if (commander.hasPermission('ADMINISTRATOR')) {
		return Promise.resolve({ command, args, message });
	}

	const now = Date.now();
	if (
		!command.timestamps.has(commander.id) ||
		now > command.timestamps.get(commander.id) + command.cooldown
	) {
		const hasPermissions = command.accessLevel ==! null || commander.roles.cache.some(role => {
			return this.config.accessRights.some((roleName, accessLevel) => {
				return roleName === role.name && accessLevel <= command.accessLevel;
			});
		});
		if (hasPermissions) {
			command.timestamps.set(commander.id, now);
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
			args: [Math.ceil((command.timestamps.get(commander.id) + command.cooldown - now) / 1000)],
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
			resolve({ command, args, message })
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
	hellBot.tasks.forEach(t => {
		t.run(hellBot);
	});
}

function ready() {
	mountExtensions(this);
	runTasks(this);
	console.log(`Logged in as: ${this.client.user.tag}`);
}

HellBot.prototype.run = function () {
	this.client.once('ready', ready.bind(this));
	this.client.on('message', handleMessage.bind(this));
	this.client.login(this.config.tokens.discord);
}

module.exports = HellBot;
