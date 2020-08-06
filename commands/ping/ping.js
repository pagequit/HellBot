const Command = require('../../src/command');

function Ping() {
    Command.call(this);
    this.trigger.push('ping');}

Ping.prototype.execute = function(args, message, { i18n, store }) {
    const locale = store.get('users').get(message.author.id).locale;
    const reply = i18n.t(locale, 'ping.pong');
    message.reply(reply);
}

module.exports = Ping;