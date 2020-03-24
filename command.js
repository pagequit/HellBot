class Command {
	constructor(client) {
		this.client = client;
		this.trigger = [];
		this.info = {
			arguments: 'none',
			description: 'none'
		};
		this.cooldown = 2971; // does each commmand realy needs a cooldown?
		this.accessLevel = null;
		this.icon = '<:hellnet:597529630114578463>';
	}

	get accessRole() {
		return this.client.guild.roles.
			find(role => role.name === this.client.config.accessRights.get(this.accessLevel))
		;
	}

	get accessColor() {
		return this.accessRole ? this.accessRole.color : 0xffffff;
	}

	toEmbed() {
		return {
			color: this.accessColor,
			title: `${this.icon} ${this.constructor.name}`,
			description: `${this.info.description}\nTrigger: ${this.trigger.join(', ')}\n`,
		};
	}

}

module.exports = Command;