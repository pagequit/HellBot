function CommandRejection(message, {reason, args}) {
    this.message = message;
    this.reason = reason;
    this.args = args;
}

CommandRejection.prototype.handle = function(hellBot) {
    const locale = hellBot.ext.store.get('users').get(this.message.author.id).locale;
    const response = hellBot.ext.i18n.t(locale, `commandRejection.${this.reason}`, this.args);
    this.message.reply(response);
}

module.exports = CommandRejection;