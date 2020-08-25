const I18nCollection = require('./i18nCollection');

class I18n extends I18nCollection {
    mount(hellBot) {
        this.fallback = hellBot.config.localeFallback;
        this.assignMessagesFiles(hellBot.config.root + hellBot.config.localeDirectory);
        hellBot.commands.forEach(c => {
            this.assignMessagesFiles(`${hellBot.config.root}${hellBot.config.commandsDirectory}/${c.domain}`, c.domain);
        });
    }
}

module.exports = I18n;