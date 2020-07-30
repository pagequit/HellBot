function commandRejection(message) {
    this.message = message;
}

commandRejection.prototype.handle = function({locale}) {
    const userLocale = locale.user[this.message.auhtor.id];
    this.message.reply()
}