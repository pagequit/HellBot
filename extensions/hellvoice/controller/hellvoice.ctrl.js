const path = require('path');
const express = require('express');

class HellVoiceController {
	constructor(hellBot) {
		this.hellBot = hellBot;

		this.hellBot.server.express.post('/hellvoice', (req, res,) => res.status(204).end());

		this.hellBot.server.express.get('/hellvoice/api', (req, res) => res.status(200).json({
			data: require('../files/api.json'),
		}));

		this.hellBot.server.express.use('/hellvoice', express.static(path.join(__dirname, '../files/')));
	}
}

module.exports = HellVoiceController;
