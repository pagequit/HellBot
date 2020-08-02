function CommandRejection(message, {reason, args}) {
    this.message = message;
    this.reason = reason;
    this.args = args;
}

CommandRejection.prototype.handle = function({ i18n, store }) {
    const fallback = store.get('config').localeFallback;

    let locale = store.get('users').get(this.message.author.id).locale;

    //let response = i18n.t(`commandRejection.${this.reason}`, this.args); <-- this is what I want!

    let response = locale[`commandRejection.${this.reason}`]
        ? locale[`commandRejection.${this.reason}`]
        : i18n.get(fallback)[`commandRejection.${this.reason}`]
    ;
    
    this.args.forEach((arg, idx) => {
        response = response.replace(`{${idx}}`, arg);
    });

    this.message.reply(response);
}

module.exports = CommandRejection;