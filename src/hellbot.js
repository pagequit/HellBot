const fs = require('fs');
const Discord = require('discord.js');
const CommandRejection = require('./commandRejection');
const I18nCollection = require('./i18nCollection');
const HellUserCollection = require('./hellUserCollection');
const Command = require('./command');

function HellBot(config, tokens, root) {
    this.config = config;
    this.config.tokens = tokens;
    this.config.root = root;
    this.client = new Discord.Client();
    this.commands = new Discord.Collection();
    this.i18n = new I18nCollection(config.localeFallback);
    this.store = new Discord.Collection([
        ['users', new HellUserCollection(this)],
    ]);
    this.i18n.assignMessagesFiles(root + config.localeDirectory);
    assignCommands.call(this, root + config.commandsDirectory);
    Command.prototype.$i18n = this.i18n;
    Command.prototype.$store = this.store;
    Command.prototype.$config = this.config;
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

function checkPermissions({command, args, message}) {
    const commander = this.store.get('guild').members.cache.find(m => m.user.id === message.author.id);

    if (commander.hasPermission('ADMINISTRATOR')) {
        return Promise.resolve({command, args, message});
    }

    const now = Date.now();
    if (
        !command.timestamps.has(commander.id) ||
        now > command.timestamps.get(commander.id) + command.cooldown
    ) {
        const hasPermissions = !command.accessLevel || commander.roles.cache.some(role => {
            return this.config.accessRights.some((roleName, accessLevel) => {
                return roleName === role.name && accessLevel <= command.accessLevel;
            });
        });
        if (hasPermissions) {
            command.timestamps.set(commander.id, now);
            return Promise.resolve({command, args, message});
        }
        return Promise.reject(new CommandRejection(message, {
            reason: 'permission',
            args: [this.config.accessRights[command.accessLevel]],
        }));
    }
    else {
        return Promise.reject(new CommandRejection(message, {
            reason: 'cooldown',
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
            resolve({command, args, message})
        }
        else {
            reject(new CommandRejection(message, {
                reason: 'undefined',
                args: [trigger],
            }));
        }
    });
}

function assignCommands(commandsDirectory) {
    const commandNames = fs.readdirSync(commandsDirectory);

    for (const name of commandNames) {
        const Command = require(`${commandsDirectory}/${name}/${name}.js`);
        const command = new Command(this.config);
        this.commands.set(command.domain, command);
        this.i18n.assignMessagesFiles(`${commandsDirectory}/${name}`, command.domain);
    }
}

function ready() {
    this.store.set('guild', this.client.guilds.cache.first());
    console.log(`Logged in as: ${this.client.user.tag}`);
}

HellBot.prototype.run = function() {
    this.client.once('ready', ready.bind(this));
    this.client.on('message', handleMessage.bind(this));
    this.client.login(this.config.tokens.discord);
}

module.exports = HellBot;