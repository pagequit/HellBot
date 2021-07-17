const Task = require('../../src/task');

class PostCorona extends Task {
	constructor() {
		super();
		this.cronTime = '00 00 09 * * *';
	}

	task(hellBot) {
		const command = hellBot.commands.find(c => c.trigger.includes('corona'));
		const channel = this.$config.guild.channels.cache
			.find(c => c.name === 'hell-news');

		command.execute(null, {
			channel: channel,
			author: {
				id: hellBot.client.user.id,
			}
		})
		.catch(error => {
			console.error(error);
		});
	}
}

module.exports = PostCorona;
