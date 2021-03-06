const Command = require('../../src/command');
const axios = require('axios');
const jsdom = require('jsdom');

class Anime extends Command {
	constructor() {
		super();
		this.trigger.push('anime', 'addanime', 'postanime');
		this.icon = ':rice_ball:';
		this.info.arguments.push('anime');
		this.channelName = 'anime-und-serien';
	}

	fetchArticleLink(response) {
		return new Promise((resolve, reject) => {
			const link = new jsdom.JSDOM(response.data)
				.window.document.querySelector('article')
				.querySelector('a.hoverinfo_trigger').href;

			if (link) {
				resolve(link);
			}
			else {
				reject(this.$i18n.t(locale, `${this.domain}.linkNotFound`));
			}
		});
	}

	execute(args, message) {
		const hellUser = this.$store.get('users')
			.get(message.author.id);

		const locale = hellUser.locale;

		if (args.length < 1) {
			message.reply(this.$i18n.t(locale, `${this.domain}.noArgs`));
			return;
		}

		axios.get(`https://myanimelist.net/search/all?q=${args}`)
			.then(this.fetchArticleLink)
			.then(link => {
				const animeChannel = this.$store.get('guild')
					.channels.cache.find(c => c.name === 'anime-und-serien');

				if (animeChannel) {
					animeChannel.send(link);
				}
				else {
					message.reply(this.$i18n.t(locale, `${this.domain}.channelNotFound`, [this.channelName]));
				}
			})
			.catch(error => {
				console.error(error);
				message.channel.send(this.$i18n.t(locale, `${this.domain}.error`));
			});
	}
}

module.exports = Anime;
