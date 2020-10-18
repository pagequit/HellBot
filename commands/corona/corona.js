const Command = require('../../src/command');
const axios = require('axios');
const jsdom = require('jsdom');

class Corona extends Command {
	constructor() {
		super();
		this.trigger.push('corona', 'covid19');
		this.icon = ':microbe:';
	}

	execute(args, message) {
		const hellUser = this.$store.get('users')
			.get(message.author.id)
		;
		const locale = hellUser.locale;

		axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html`)
			.then(this.fetchData)
			.then(values => {
				message.channel.send({
					embed: this.responseToEmbed(locale, values)
				});
			})
			.catch(error => {
				console.error(error);
				message.channel.send(this.$i18n.t(locale, `${this.domain}.error`));
			})
		;
	}

	fetchData(response) {
		return new Promise((resolve, reject) => {
			const { window } = new jsdom.JSDOM(response.data);

			if (!window) {
				reject(this.$i18n.t(locale, `${this.domain}.error`));
			}

			const targetRow = window.document.querySelector('tbody').lastChild;

			resolve({
				total: targetRow.childNodes[1].textContent,
				alteration: targetRow.childNodes[2].textContent,
				sevenDays: targetRow.childNodes[3].textContent,
				SDI: targetRow.childNodes[4].textContent,
				fatal: targetRow.childNodes[5].textContent,
			});
		});
	}

	responseToEmbed(locale, data) {
		return {
			color: 0xf5f5f5,
			title: 'RKI - Coronavirus SARS-CoV-2 - COVID-19',
			url: 'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html',
			description: 'Germany',
			fields: [
				{
					name: this.$i18n.t(locale, `${this.domain}.alteration`),
					value: data.alteration,
					inline: true,
				},
				{
					name: this.$i18n.t(locale, `${this.domain}.sevenDays`),
					value: data.sevenDays,
					inline: true,
				},
				{
					name: this.$i18n.t(locale, `${this.domain}.SDI`),
					value: data.SDI,
					inline: true,
				},
			],
		};
	}
}

module.exports = Corona;
