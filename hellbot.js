class HellBot {
	constructor(config) {
		this.config = {
			prefix: config.prefix,
			token: config.token,
		};

		this.command = {};
	}
}

module.exports = HellBot;