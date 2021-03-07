const { Collection } = require('discord.js');
const fs = require('fs');

class I18nCollection extends Collection {
	constructor(fallback, args) {
		super(args);
		this.fallback = fallback;
	}

	t(locale, key, args = []) {
		const messages = this.has(locale)
			? this.get(locale)
			: this.get(this.fallback);

		let message = messages[key]
			|| this.get(this.fallback)[key]
			|| this.find(l => !!l[key])
			|| `${key}`;

		args.forEach((arg, idx) => {
			message = message.replace(`{${idx}}`, arg);
		});

		return message;
	}

	assignMessagesFiles(folder, domain) {
		const messagesFiles = fs.readdirSync(folder)
			.filter(f => f.endsWith('.messages.json'));

		for (const fileName of messagesFiles) {
			const messages = require(`${folder}/${fileName}`);
			const locale = fileName.substr(0, 2);

			if (domain) {
				for (let key in messages) {
					messages[`${domain}.${key}`] = messages[key];
					delete messages[key];
				}
			}

			if (this.has(locale)) {
				Object.assign(this.get(locale), messages);
			}
			else {
				this.set(locale, messages);
			}
		}
	}
}

module.exports = I18nCollection;
