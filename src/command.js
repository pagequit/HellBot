const { Collection } = require('discord.js');

class Command {
	constructor(hellbot) {
		this.hellbot = hellbot;
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
		return {
			color: this.accessColor,
			title: `${this.icon} ${this.name}`,
			description: this.$i18n.t(locale, this.info.description),
		}
	}
}

module.exports = Command;