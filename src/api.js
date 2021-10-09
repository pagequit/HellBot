const crypto = require('crypto');

class API {
	constructor(hellBot) {
		this.hellBot = hellBot;
	}

	async checkAuhterization(req, res, next) {
		res.header('Access-Control-Allow-Origin', `${process.env.API_ALLOW_ORIGIN}`);
		res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization');
		res.header('Access-Control-Allow-Credentials', 'true');

		// check for preflight requests
		if (req.method === 'OPTIONS' && req.header('Origin') && req.header('Access-Control-Request-Method')) {
			return res.status(204).end();
		}

		const authorization = req.header('Authorization')?.match(/^(Bearer)\s([0-9a-f]+)$/);
		const authScheme = !!authorization ? authorization[1] : null;
		const authToken = !!authorization ? authorization[2] : null;

		if (!req.session.gmid || !authorization || authScheme !== 'Bearer') {
			res.status(400);

			return res.json({
				error: 'Bad Request'
			});
		}

		const tokenHash = crypto.createHash('sha256')
			.update(authToken)
			.digest('hex');

		const prismaUser = !!req.session.gmid
			? await this.hellBot.ext.prisma.user.findUnique({
				where: {
					access_token: req.session.gmid,
				},
			})
			: await this.hellBot.ext.prisma.user.findUnique({
				where: {
					access_token: tokenHash,
				},
			});

		if (prismaUser === null) {
			res.status(401);

			return res.json({
				error: 'Unauthorized'
			});
		}

		try {
			const guildMember = await this.hellBot.config.guild.members
				.fetch(`${prismaUser.id}`);

			req.session.gmid = guildMember.id;
			next();
		}
		catch(error) {
			console.error(error);
			res.status(500);

			return res.end();
		}
	}
}

module.exports = API;
