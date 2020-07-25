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
        parseCommand.call(this, message).then(({command, args}) => {
            command.execute({args, message});
        }).catch(err => console.error(err));
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
    return Promise.resolve({command, args});
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

function ready () {
    console.log(`Logged in as: ${this.client.user.tag}`);
}

HellBot.prototype.run = function() {
    this.client.once('ready', ready.bind(this));
    this.client.on('message', handleMessage.bind(this));
    this.client.login(this.tokens.discord);
}

module.exports = HellBot;