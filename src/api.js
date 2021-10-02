class API {
	constructor(hellBot) {
		this.hellBot = hellBot;
		this.hellBot.server.router.post('/', this.reply.bind(this));
	}

	async reply(req, res) {
		const authorization = req.header('Authorization')?.match(/^(Bearer)\s([0-9a-f]+)$/);
		const authScheme = !!authorization ? authorization[1] : null;
		const authToken = !!authorization ? authorization[2] : null;

		if (!authorization || authScheme !== 'Bearer') {
			res.status(400);
			res.json({
				error: 'Bad Request'
			});
			return;
		}

		const prismaUser = await this.hellBot.ext.prisma.user.findUnique({
			where: {
				access_token: authToken,
			},
		});

		if (prismaUser === null) {
			res.status(401);
			res.json({
				error: 'Unauthorized'
			});
			return;
		}

		res.json(prismaUser);
	}
}

module.exports = API;
