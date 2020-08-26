const Command = require('../../src/command');

class Ping extends Command {
    constructor() {
        super();
        this.trigger.push('ping');
        this.icon = ':ping_pong:';
    }

    execute(args, message) {
        const locale = this.$store.get('users').get(message.author.id).locale;
        const reply = this.$i18n.t(locale, `${this.domain}.pong`);
        message.reply(reply);
    }
}

module.exports = Ping;