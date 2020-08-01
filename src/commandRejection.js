function CommandRejection(message, {reason, args}) {
    this.message = message;
    this.reason = reason;
    this.args = args;
}

CommandRejection.prototype.handle = function({i18n, store}) {
    const fallback = store.get('config').localeFallback;

    let locale = store.has(this.message.author.id)
        ? store.get(this.message.author.id).locale
        : fallback
    ;

    locale = i18n.has(locale)
        ? i18n.get(locale)
        : fallback
    ;

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