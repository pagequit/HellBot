class Command {
	constructor(owner) {
		this.owner = owner;
		this.trigger = [];
		this.info = {
			arguments: 'none',
			description: 'none'
		};
		this.cooldown = 0;
		this.privileged = [];
	}

	execute(args, message) {
		// check privileges?
	}
}

module.exports = Command;