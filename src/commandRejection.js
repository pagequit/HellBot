function CommandRejection(message) {
    this.message = message;
}

CommandRejection.prototype.handle = function({i18n}) {
    const userLocale = i18n.user.locale(message.author.id);
    const reply = i18n[userLocale].defaultCommandRejectionReply;
    this.message.reply(reply);
}

function CommandNotFoundRejection(message) {
    CommandRejection.call(this, message);
}

CommandNotFoundRejection.prototype.handle = function({i18n}) {
    const userLocale = i18n.user.locale(message.author.id);
    const reply = i18n[userLocale].defaultCommandRejectionReply;
    this.message.reply(reply);    
}

module.exports = {
    CommandNotFoundRejection
}