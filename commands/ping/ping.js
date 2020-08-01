const Command = require('../../src/command');

function Ping() {
    Command.call(this, __dirname);
    this.trigger.push('ping');
    this.accessLevel = 1;
    this.cooldown = 3;
}

Ping.prototype.execute = function(args, message, { i18n, store }) {
    let locale = store.has(message.author.id)
        ? store.get(message.author.id)
        : store.get('config').localeFallback
    ;

    const reply = this.locale.get(locale).pong;
    message.reply(reply);
}

module.exports = Ping;