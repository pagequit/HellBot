const Command = require('../command');
const axios = require('axios');
const jsdom = require('jsdom');

class Corona extends Command {
	constructor(client) {
		super(client);
		this.trigger = ['corona', 'covid19'];
		this.info.description = 'Displayes the total cases of COVID-19 in Germany.';
		this.icon = '<:microbe:697052944394354789>';
		this.accessLevel = 2;
	}

	fetchData(response) {
		return new Promise((resolve, reject) => {
			const dom = new jsdom.JSDOM(response.data);

			if (!dom.window) {
				reject('Sry, that doesn\'t work.');
			}

			var node, walk = dom.window.document.createTreeWalker(
				dom.window.document.body,
				dom.window.NodeFilter.SHOW_ELEMENT,
				null,
				false
			);

			const values = {
				total: 0,
				diff: 0,
				calc: 0,
				fatal: 0
			};

			while(node = walk.nextNode()) {
				if (node.nodeName === 'TD' && node.textContent === 'Gesamt') {
					values.total = node.parentNode.childNodes[1].textContent;
					values.diff = node.parentNode.childNodes[2].textContent;
					values.calc = node.parentNode.childNodes[3].textContent;
					values.fatal = node.parentNode.childNodes[4].textContent;
				}
			}

			resolve(values);
		});
	}

	responseToEmbed(data) {
		return {
			color: 0xf5f5f5,
			title: 'RKI - Coronavirus SARS-CoV-2 - COVID-19',
			url: 'https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html',
			description: 'Germany',
			fields: [
				{
					name: `Total`,
					value: data.total,
					inline: true,
				},
				{
					name: `Alteration`,
					value: data.diff,
					inline: true,
				},
				{
					name: `Fatality`,
					value: data.fatal,
					inline: true,
				},
			],
		};
	}

	execute(args, message) {
		axios.get(`https://www.rki.de/DE/Content/InfAZ/N/Neuartiges_Coronavirus/Fallzahlen.html`)
			.then(this.fetchData)
			.then(values => {
				message.channel.send({
					embed: this.responseToEmbed(values)
				});
			})
			.catch(reason => {
				console.log(reason);
				this.client.handleRejection(message, reason);
			})
		;
	}
}

module.exports = Corona;