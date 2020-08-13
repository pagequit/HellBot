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
		this.icon = ':robot;';
		this.info = {
			arguments: new Map(),
			description: `${this.domain}.description`,
		}
	}

	execute(args, message) {
		throw new Error('Try to call execute from abstract Command!');
	}

	toEmbed() {
		return {
			color: '',
			title: '',
			description: '',
		}
	}
}

module.exports = Command;