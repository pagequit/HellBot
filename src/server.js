const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

function Server(hellBotAPI) {
	this.port = process.env.API_PORT;
	this.express = express();
	this.router = express.Router();

	this.express.use(session({
		store: new FileStore(),
		secret: process.env.API_SECRET,
		saveUninitialized: false,
		resave: false,
	}));
	this.express.use(express.json());
	this.express.use(hellBotAPI.checkAuhterization.bind(hellBotAPI));
	this.express.use(this.router);
}

Server.prototype = {
	start() {
		this.express.listen(this.port, () => {
			console.log('Server listen on PORT: ' + this.port);
		});
	},
}

module.exports = Server;
// curl -X POST http://localhost:3033/ -H "Authorization: Bearer cf2939b501725bd83934cc85b1015b48"
