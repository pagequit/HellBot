function commandRejection(message) {
    this.message = message;
}

commandRejection.prototype.handle = function({locale}) {
    const userLocale = locale.userSettings[this.message.auhtor.id];
    this.message.reply()
}