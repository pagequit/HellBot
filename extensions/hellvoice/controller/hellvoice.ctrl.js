const path = require('path');
const express = require('express');

class HellVoiceController {
	constructor(hellBot) {
		this.hellBot = hellBot;
		this.hellBot.server.express.use('/hellvoice', express.static(path.join(__dirname, '../files/')));
	}
}

module.exports = HellVoiceController;
