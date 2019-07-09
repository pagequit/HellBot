const Command = require('../command');
const https = require('https');

class Weather extends Command {
	constructor(owner) {
		super(owner);
		this.trigger = ['weather', 'wetter'];
		this.info.description = 'Showes the current weather.';
		this.icon = '<:white_sun_rain_cloud:598218200542347276>';
	}

	toEmbed(data) {
		return {
			color: 0xffffff,
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

		let output = '';

		https.get(`https://api.darksky.net/forecast/${this.owner.tokens.darksky}/50.7359,7.1007?lang=de&units=auto`, (res) => {
			console.log('statusCode:', res.statusCode);
			console.log('headers:', res.headers);

			res.on('data', data => {
				output += data;
			});

			res.on('end', () => {
				message.channel.send({ embed: this.toEmbed(JSON.parse(output)) });
			});

		}).on('error', (error) => {
			console.error(error);
			message.reply('My Wetterfrosch is not responding.');
		});
	}
}

module.exports = Weather;