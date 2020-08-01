const Command = require('../../src/command');

function Ping() {
    Command.call(this, __dirname);
    this.trigger.push('ping');
    this.accessLevel = 1;
    this.cooldown = 3;
}

Ping.prototype.execute = function(args, message, { i18n }) {
    const reply = this.locale[i18n.user.locale(message.author.id)].pong;
    message.reply(reply);
}

module.exports = Ping;