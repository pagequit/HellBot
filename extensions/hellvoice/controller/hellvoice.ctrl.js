const path = require('path');
const express = require('express');

class HellVoiceController {
	constructor(hellBot) {
		this.hellBot = hellBot;

		//this.hellBot.server.router.post('/hellvoice', this.defaultAction.bind(this));
		this.hellBot.server.express.use('/hellvoice', express.static(path.join(__dirname, '../files/')));
	}

	async defaultAction(req, res, next) {
		res.json(req.guildMember);
		next();
	}
}

module.exports = HellVoiceController;
