const Command = require('../command');
const axios = require('axios');

class Weather extends Command {
	constructor(client) {
		super(client);
		this.trigger = ['weather', 'wetter'];
		this.info.description = 'Showes the current weather.';
		this.icon = '<:white_sun_rain_cloud:598218200542347276>';
	}

	responseToEmbed(data) {
		return {
			color: 0xf5f5f5,
			title: 'Powered by Dark Sky',
			url: 'https://darksky.net/poweredby/',
			description: 'Bonn',
			thumbnail: {
				url: `https://darksky.net/images/weather-icons/${data.currently.icon}.png`,
			},
			fields: [
				{
					name: `${Math.round(data.currently.temperature)}°C`,
					value: data.currently.summary,
				},
			],
			timestamp: new Date(),
		};
	}

	execute(args, message) {
		let location = '50.7359,7.1007';
		const url = `https://api.darksky.net/forecast/${this.client.tokens.darksky}/${location}?lang=de&units=auto`;

		axios.get(url)
			.then(res => {
				message.channel.send({
					embed: this.responseToEmbed(res.data)
				});
			})
			.catch(error => {
				console.log(error);
				message.reply('My Wetterfrosch is not responding.');
			})
		;
	}
}

module.exports = Weather;