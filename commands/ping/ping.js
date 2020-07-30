const Command = require('../../src/command');

function Ping() {
    Command.call(this, __dirname);
    this.trigger.push('ping');
    this.accessLevel = 1;
    this.cooldown = 3;
}

Ping.prototype.execute = function(args, message) {
    message.reply('pong');
}

module.exports = Ping;