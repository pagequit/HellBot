const Command = require('../../src/command');

class Ping extends Command {
    constructor(hellbot) {
        super(hellbot);
        this.trigger.push('ping');
        this.icon = ':ping_pong:';
    }

    execute(args, message) {
        const users = this.hellbot.store.get('users');
        const locale = users.get(message.author.id).locale;
        const reply = this.hellbot.i18n.t(locale, 'ping.pong');
        message.reply(reply);
    }
}

module.exports = Ping;