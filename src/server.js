const express = require('express');
const session = require('express-session');
// const redis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client = redis.createClient();
const router = express.Router();

// router.get('/', (req, res) => {
//  const queryObject = url.parse(req.url, true).query;
// });

// curl -X POST http://localhost:3033/ -H "Authorization: Bearer cf2939b501725bd83934cc85b1015b48"
const { Collection } = require('discord.js');

function Server() {
	this.port = process.env.API_PORT;
	this.express = express();
	this.router = express.Router();

	this.express.use(express.json());
	this.express.use(session({
		//store: new redisStore({ client }),
		secret: process.env.API_SECRET,
		saveUninitialized: false,
		resave: false,
	}));
	this.express.use(express.json());
	this.express.use('/', this.router);
}

Server.prototype = {
	start() {
		this.express.listen(this.port, () => {
			console.log('Server listen on PORT: ' + this.port);
		});
	},
}

module.exports = Server;
