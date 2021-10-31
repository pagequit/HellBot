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
		if (req.method === 'OPTIONS'
			&& req.header('Origin')
			&& req.header('Access-Control-Request-Method')
		) {
			return res.status(204).end();
		}

		const authorization = req.header('Authorization')?.match(/^(Bearer)\s([0-9a-f]+)$/);
		const accessToken = !authorization ? null : authorization[2];

		if (!accessToken && !req.session.gmid) {
			return res.status(400).json({
				access: 'denied',
				error: '1634591779621',
			});
		}

		const prismaUser = !req.session.gmid
			? await this.hellBot.ext.prisma.user.findUnique({
				where: {
					access_token: crypto.createHash('sha256')
						.update(accessToken)
						.digest('hex'),
				},
			})
			: await this.hellBot.ext.prisma.user.findUnique({
				where: {
					id: req.session.gmid,
				},
			});

		if (prismaUser === null) {
			return res.status(401).json({
				access: 'denied',
				error: '1634591836174',
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
			return res.status(500).json({
				access: 'denied',
				error: '1634591887807',
			});
		}
	}
}

module.exports = API;
