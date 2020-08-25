const { Collection, MessageEmbed } = require('discord.js');

class Command {
	constructor() {
		this.name = this.constructor.name;
		this.domain = this.name.toLocaleLowerCase();
		this.trigger = [];
		this.accessLevel = null;
		this.cooldown = 0;
		this.timestamps = new Collection();
		this.icon = ':robot:';
		this.info = {
			arguments: [],
			description: `${this.domain}.description`,
		}
	}

	get accessRole() {
		return this.$store.get('guild').roles.cache.
			find(r => r.name === this.$config.accessRights[this.accessLevel])
		;
	}

	get accessColor() {
		return this.accessRole ? parseInt(`0x${this.accessRole.hexColor.slice(1)}`) : 0xf5f5f5;
	}

	execute(args, message) {
		throw new Error('Try to call execute from abstract Command!');
	}

	toEmbed(locale) {
		let description = this.$i18n.t(locale, this.info.description);
		description += `\n${this.$i18n.t(locale, 'embed.trigger')}: ${this.trigger.join(', ')}`;
		description += `\n${this.$i18n.t(locale, 'embed.arguments')}:`;
		
		const embed = new MessageEmbed();
		embed.setColor(this.accessColor);
		embed.setTitle(`${this.icon} ${this.name}`);
		embed.setDescription(description);
		this.info.arguments.forEach(arg => {
			const signature = this.$i18n.t(locale, `${this.domain}.arguments.${arg}.signature`);
			const description = this.$i18n.t(locale, `${this.domain}.arguments.${arg}.description`);
			embed.addField(signature, description);
		});

		return embed;
	}
}

module.exports = Command;