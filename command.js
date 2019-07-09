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
		this.icon = '<:hellnet:597529630114578463>';
	}

	getEmbed() {
		const accessRole = this.owner.config.accessRights.get(this.accessLevel);
		const targetRole = this.owner.guild.roles
			.find(role => role.name === accessRole )
		;
		const accessColor = targetRole ? targetRole.color : 0xffffff;

		return {
			color: accessColor,
			title: `${this.icon} ${this.constructor.name}`,
			description: `${this.info.description}\nTrigger: ${this.trigger.join(', ')}\n`,
		};
	}

	execute(args, message) {
		throw 'command exception';
	}
}

module.exports = Command;