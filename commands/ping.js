const Command = require('../abstract/command');

function Ping(client) {
    Command.call(this, client);
    this.trigger.push('ping');
    this.accessLevel = 1;
    this.cooldown = 3;
}

Ping.prototype.execute = function(args, message) {
    message.reply('pong');
}

module.exports = Ping;