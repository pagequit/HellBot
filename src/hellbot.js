const config = require('../config.json');
const tokens = require('../tokens.json');
const fs = require('fs');
const Discord = require('discord.js');
const { assignLocale } = require('./lib');
const { CommandNotFoundRejection } = require('./commandRejection');

function HellBot(dirname) {
    this.root = dirname;
    this.config = config;
    this.tokens = tokens;
    this.client = new Discord.Client();
    this.commands = new Discord.Collection();
    this.i18n = new Discord.Collection([
        ['user', {
            locale: id => this[id] ? this[id] : config.localeFallback
        }],
    ]);

    assignLocale(this.i18n, this.root + config.localeDirectory);
    assignCommands.call(this);
}

function handleMessage(message) {
    if (message.author.bot) {
        return;
    }

    if (message.mentions.has(this.client.user)) {
        parseCommand.call(this, message)
            .then(checkPermissions.bind(this))
            .then(({command, args}) => {
                command.execute(args, message, this);
            })
            .catch(rejection => {
                rejection.handle(this);
            })
        ;
    }
}

function checkPermissions({command, args, message}) {
    const commander = this.guild.members.cache.find(m => m.user.id === message.author.id);

    if (commander.hasPermission('ADMINISTRATOR')) {
        return Promise.resolve({command, args, message});
    }

    const now = Date.now();
    if (
        !command.timestamps.has(commander.id) ||
        now > command.timestamps.get(commander.id) + command.cooldown
    ) {
        let hasPermissions = !command.accessLevel || commander.roles.cache.some(role => {
            return this.config.accessRights.some((roleName, accessLevel) => roleName === role.name && accessLevel <= command.accessLevel);
        });
        if (hasPermissions) {
            command.timestamps.set(commander.id, now);
            return Promise.resolve({command, args, message});
        }
        return Promise.reject(new permissionDeniedRejection(message));
    }
    else {
        return Promise.reject(new cooldownRejection(message));
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
            resolve({command, args, message})
        }
        else {
            reject(new CommandNotFoundRejection(message, rawCommand));
        }
    });
}

function assignCommands() {
    const dir = this.config.commandsDirectory;
    const commandNames = fs.readdirSync(this.root + dir);

    for (const name of commandNames) {
        const Command = require(`${this.root}${dir}/${name}/${name}.js`);
        this.commands.set(name, new Command());
    }
}

function ready() {
    this.guild = this.client.guilds.cache.find(g => g.name === this.config.guild);
    console.log(`Logged in as: ${this.client.user.tag}`);
}

HellBot.prototype.run = function() {
    this.client.once('ready', ready.bind(this));
    this.client.on('message', handleMessage.bind(this));
    this.client.login(this.tokens.discord);
}

module.exports = HellBot;