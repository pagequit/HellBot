class Command {
	constructor(owner) {
		this.owner = owner;
		this.trigger = [];
		this.info = {
			arguments: 'none',
			description: 'none'
		};
		this.cooldown = 0;
		this.accessLevel = null;
	}

	execute(args, message) {
		throw 'command exception';
	}

	isPermitted(member) {
		if ( this.accessLevel && member ) {
			if ( this.owner.client.guild !== member.guild ) {
				throw 'guild exception';
			}

			return this.owner.config.accessRights[member.role] > this.accessLevel;
		}
	}
}

module.exports = Command;