const Command = require('../../src/command');

class Ping extends Command {
    constructor(hellbot) {
        super(hellbot);
        this.trigger.push('ping');
    }

    execute(args, message, { i18n, store }) {
        const locale = store.get('users').get(message.author.id).locale;
        const reply = i18n.t(locale, 'ping.pong');
        message.reply(reply);
    }
}

module.exports = Ping;