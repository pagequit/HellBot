const Command = require('../command');
const axios = require('axios');
const jsdom = require('jsdom');

class AddAnime extends Command {
	constructor(client) {
		super(client);
		this.trigger = ['addanime', 'anime'];
		this.info.description = 'Adds a anime to the anime-und-serien channel.';
		this.icon = '<:rice_ball:640111239996899328>';
		this.accessLevel = 2;
	}

	fetchArticleLink(response) {
		return new Promise((resolve, reject) => {
			const link = new jsdom.JSDOM(response.data)
				.window.document.querySelector('article').querySelector('a.hoverinfo_trigger').href
			;

			if (link) {
				resolve(link);
			}
			else {
				reject('Sry, I don\'t find any useful link.');
			}
		});
	}

	execute(args, message) {
		if ( args.length < 1 ) {
			message.reply('I need an anime name in order to post one!');
			return;
		}

		axios.get(`https://myanimelist.net/search/all?q=${args}`)
			.then(this.fetchArticleLink)
			.then(link => {
				const animeChannel = this.client.guild.channels.find(channel => channel.id === '583359953012654085');
				if ( animeChannel ) {
					animeChannel.send(link);
				}
				else {
					message.reply('Sry, I can\'t find the anime channel.');
				}
			})
			.catch(reason => {
				console.log(reason);
				this.client.handleRejection(message, reason);
			})
		;
	}
}

module.exports = AddAnime;