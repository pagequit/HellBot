const axios = require('axios');

module.exports = function postCorona() {
	let location = '50.7359,7.1007';
	const url = `https://api.darksky.net/forecast/${this.tokens.darksky}/${location}?lang=de&units=auto`;

	axios.get(url)
		.then(({data}) => {
			this.guild.systemChannel.send({
				embed: {
					color: 0xf5f5f5,
					title: 'Powered by Dark Sky',
					url: 'https://darksky.net/poweredby/',
					description: 'Bonn',
					thumbnail: {
						url: `https://darksky.net/images/weather-icons/${data.daily.data[0].icon}.png`,
					},
					fields: [
						{
							name: `${Math.round(data.daily.data[0].temperatureLow)} - ${Math.round(data.daily.data[0].temperatureHigh)}°C`,
							value: data.daily.data[0].summary,
						},
					],
				}
			});
		})
		.catch(error => {
			console.log(error);
		})
	;
}