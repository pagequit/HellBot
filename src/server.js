const express = require('express');
const session = require('express-session');
// const redis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client = redis.createClient();
const router = express.Router();
//const app = express();

// app.use(express.json());

// app.use(session({
// //	store: new redisStore({ client }),
// 	secret: '1234',
// 	saveUninitialized: false,
// 	resave: false,
// }));

// router.get('/', (req, res) => {
// 	const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);

// 	console.log(req.url);
// 	res.json(req.session);
// });

// router.post('/auth', (req, res) => {
// 	console.log(req.body.token);
// 	res.json(req.session);
// });

// app.use('/', router);

// app.listen(process.env.API_PORT, () => {
// 	console.log('API listen on Port ' + process.env.API_PORT);
// });

//curl -X POST localhost:3033/auth -H "Content-Type: application/json" -d '{"token":"1234"}'
const { Collection } = require('discord.js');

function Server() {
	this.port = process.env.API_PORT;
	this.express = express();
	this.router = express.Router();

	this.express.use(express.json());
	this.express.use(session({
		//store: new redisStore({ client }),
		secret: '1234',
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
