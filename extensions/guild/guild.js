class Guild {
	mount({ client }) {
		Object.assign(
			this,
			client.guilds.cache.first()
		);
	}
}

module.exports = Guild;
