const Command = require('../abstract/command');

function Ping(client) {
    Command.call(this, client);
    this.trigger.push('ping');
    this.cooldown = 3;
}

Ping.prototype.execute = function({message}) {
    message.reply('pong');
}

module.exports = Ping;