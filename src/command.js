const { Collection } = require('discord.js');

function Command() {
	this.trigger = [];
	this.accessLevel = null;
	this.cooldown = 0;
	this.timestamps = new Collection();
	this.icon = '';
	this.domain = this.constructor.name.toLowerCase();
	this.description = `${this.domain}.description`;
}

Command.prototype.execute = function(args, message) {
	throw new Error('Try to call execute from abstract Command!');
}

module.exports = Command;