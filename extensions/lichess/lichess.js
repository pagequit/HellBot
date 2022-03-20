const Extension = require(`${process.env.APP_ROOT}/src/extension`);
const redis = require('redis');

class Lichess extends Extension {
	handleMessages() {
		this.hedis.subscribe('lichess', message => {
			const messageObj = JSON.parse(message);

			console.log(messageObj);

			const channel = this.hellBot.config.guild.channels.cache
				.find(c => c.name === 'debug');

			channel.send({
				embed: {
					color: 0xb72fc6,
					title: messageObj.link,
					url: messageObj.link,
					fields: [
						{
							name: messageObj.author,
							value: messageObj.content,
						},
					],
				}
			});
		});
	}

	mount(hellBot) {
		this.hellBot = hellBot;
		this.hedis = redis.createClient();

		this.hedis.connect().then(() => {
			this.handleMessages();
		});
	}
}

module.exports = Lichess;
