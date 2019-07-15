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

	get accessRole() {
		return this.owner.guild.roles.
			find(role => role.name === this.owner.config.accessRights.get(this.accessLevel))
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

	isNotPermittedFor(user) {
		const member = user.client.guilds.find(guild => guild === this.owner.guild)
			.members.find(member => member.user.username === user.username)
		;

		if ( this.accessLevel === null || member.roles.some(role => role.hasPermission('ADMINISTRATOR')) ) {
			return false;
		}

		let isNotPermitted = true;
		member.roles.forEach(role => {
			this.owner.config.accessRights.forEach((roleName, accessLevel) => {
				if ( roleName === role.name && accessLevel <= this.accessLevel ) {
					isNotPermitted = false;
				}
			});
		});

		return isNotPermitted;
	}
}

module.exports = Command;