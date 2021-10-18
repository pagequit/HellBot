const path = require('path');
const express = require('express');

class HellVoiceController {
	constructor(hellBot) {
		this.hellBot = hellBot;

		this.hellBot.server.express.post('/hellvoice', (req, res,) => res.status(200).json({ access: 'granted' }));
		this.hellBot.server.express.use('/hellvoice', express.static(path.join(__dirname, '../files/')));
	}
}

module.exports = HellVoiceController;
