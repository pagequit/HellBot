function CommandRejection(message, {reason, args}) {
    this.message = message;
    this.reason = reason;
    this.args = args;
}

CommandRejection.prototype.handle = function({ i18n, store }) {
    const locale = store.get('users').get(this.message.author.id).locale;
    const response = i18n.t(locale, `commandRejection.${this.reason}`, this.args);
    this.message.reply(response);
}

module.exports = CommandRejection;