const Controller = require(`${process.env.APP_ROOT}/src/controller`);
const url = require('url');

class HellVoiceController extends Controller {
	constructor(hellBot) {
		super(hellBot);

		this.hellBot.server.router.get('/', this.rootAction.bind(this));
	}

	async rootAction(req, res) {
		const queryObject = url.parse(req.url, true).query;

		const prismaUser = await this.hellBot.ext.prisma.getPrismaUserById(queryObject.id);

		res.json(prismaUser);
	}
}

module.exports = HellVoiceController;
