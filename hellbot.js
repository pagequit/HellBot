const fs = require('fs');
const Discord = require('discord.js');

function HellBot({config, tokens}) {
    this.config = config;
    this.tokens = tokens;
    this.client = new Discord.Client();
    this.commands = new Discord.Collection();

    assignCommands.call(this);
}

function handleMessage(message) {
    if (message.author.bot) {
        return;
    }

    if (message.mentions.has(this.client.user)) {
        parseCommand.call(this, message)
            .then(checkAccess.bind(this))
            .then(({command, args}) => {
                command.execute({args, message});
            })
            .catch(rejection => {
                rejection.handle();
            })
        ;
    }
}

function checkAccess({command, args, message}) {
    const commander = this.guild.members.cache.find(m => m.user.username === message.author.username);

    if (commander.roles.cache.some(r => r.hasPermission('ADMINISTRATOR'))) { // <-- hasPermission works no longer how I thought
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
        return Promise.reject(new permissionDeniedRejection({message}));``
    }
    else {
        return Promise.reject(new cooldownRejection({message}));
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
            reject(new commandNotFoundRejection({message, rawCommand}));
        }
    });
}

function assignCommands() {
    const commandFiles = fs.readdirSync(this.config.commandsDirectory)
        .filter(file => file.endsWith('.js'))
    ;

    for (const file of commandFiles) {
        const commandClass = require(`${this.config.commandsDirectory}/${file}`);
        const command = new commandClass(this.client);

        this.commands.set(
            command.constructor.name.toLowerCase(),
            command
        );
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