const Command = require('../../src/command');

function Ping() {
    Command.call(this, __dirname);
    this.trigger.push('ping');
    this.accessLevel = null;
    this.cooldown = 5000;
}

Ping.prototype.execute = function(args, message, { i18n, store }) {
    let locale = store.get('users').get(message.author.id).locale;

    const reply = this.locale.get(locale).pong;
    message.reply(reply);
}

module.exports = Ping;