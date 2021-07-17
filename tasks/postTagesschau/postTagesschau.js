const Task = require('../../src/task');
const axios = require('axios');

class PostTagesschau extends Task {
	constructor() {
		super();
		this.cronTime = '*/5 * * * *';
	}

	task(hellBot) {
		const url = `https://www.tagesschau.de/api2/`;
		const channel = this.$config.guild.channels.cache
			.find(c => c.name === 'hell-news');

		axios.get(url)
			.then(({ data }) => {
				data.news.filter(n => n.breakingNews).forEach(bn => {
					channel.send(bn.shareURL);
				});
			})
			.catch(error => {
				console.error(error);
			});
	}
}

module.exports = PostTagesschau;
