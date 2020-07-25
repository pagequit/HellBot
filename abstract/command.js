function Command(client) {
	this.client = client;
	this.trigger = [];
}

Command.prototype.execute = function({args, message}) {
	throw new Error('Try to call execute from abstract Command!')
}

module.exports = Command;