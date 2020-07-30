const { Collection } = require('discord.js');
const { assignLocale } = require('./lib');


function Command(dirname) {
	this.trigger = [];
	this.accessLevel = null;
	this.cooldown = 0;
	this.timestamps = new Collection();
	this.locale = new Map();
	assignLocale(this.locale, dirname);
}

Command.prototype.execute = function(args, message) {
	throw new Error('Try to call execute from abstract Command!');
}

module.exports = Command;