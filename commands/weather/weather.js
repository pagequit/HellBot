const Command = require('../../src/command');
const axios = require('axios');

class Weather extends Command {
	constructor() {
		super();
		this.trigger.push('weather', 'wetter');
		this.icon = ':white_sun_rain_cloud:';
	}

	execute(args, message) {
		const hellUser = this.$store.get('users')
			.get(message.author.id);

		const locale = hellUser.locale;

		let location = '50.732704162597656,7.096311092376709';
		const url = `https://api.darksky.net/forecast/${process.env.DARKSKY_KEY}/${location}?lang=${locale}&units=auto`;

		axios.get(url)
			.then(res => {
				message.channel.send({
					embed: this.responseToEmbed(res.data),
				});
			})
			.catch(error => {
				console.error(error);
				message.channel.send(this.$i18n.t(locale, `${this.domain}.error`));
			})
		;
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
}

module.exports = Weather;
