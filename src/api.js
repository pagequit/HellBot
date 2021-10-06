const crypto = require('crypto');

class API {
	constructor(hellBot) {
		this.hellBot = hellBot;
	}

	async checkAuhterization(req, res, next) {
		const authorization = req.header('Authorization')?.match(/^(Bearer)\s([0-9a-f]+)$/);
		const authScheme = !!authorization ? authorization[1] : null;
		const authToken = !!authorization ? authorization[2] : null;

		if (!authorization || authScheme !== 'Bearer') {
			res.status(400);

			return res.json({
				error: 'Bad Request'
			});
		}

		const tokenHash = crypto.createHmac('sha256', process.env.API_SECRET)
			.update(authToken)
			.digest('hex');

		const prismaUser = await this.hellBot.ext.prisma.user.findUnique({
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

			req.guildMember = guildMember;
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
