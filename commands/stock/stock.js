const Command = require('../../src/command');
const axios = require('axios');
const jsdom = require('jsdom');
const { MessageEmbed } = require('discord.js');

class Stock extends Command {
	constructor() {
		super();
		this.trigger.push('stock');
		this.icon = ':chart_with_upwards_trend:';
	}

	async execute(args, message) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		axios.get(`https://www.xetra.com/xetra-de/`)
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

			const date = window.document.querySelector('.teaserBox.indices .title .date').textContent;
			const stocks = window.document.querySelectorAll('.teaserBox.indices .dataTable .stock');
			const performances = window.document.querySelectorAll('.teaserBox.indices .dataTable .performance');
			const values = window.document.querySelectorAll('.teaserBox.indices .dataTable .value');
			const entries = [];

			for (let i = 0; i < 3; i++) {
				entries.push({
					stock: stocks[i].textContent,
					performance: performances[i].textContent,
					value: values[i].textContent,
				});
			}

			resolve({
				date,
				entries,
			});
		});
	}

	responseToEmbed(locale, data) {
		const embed = new MessageEmbed()
			.setColor(0xf5f5f5)
			.setTitle('Stocks courses by XETRA')
			.setURL('https://www.xetra.com/xetra-de/')
			.setDescription(data.date);

		data.entries.forEach(entry => {
			embed.addFields({
				name: entry.stock,
				value: `${entry.performance}\t${entry.value}`,
				inline: true,
			});
		});

		return embed;
	}
}

module.exports = Stock;
