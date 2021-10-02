const Controller = require(`${process.env.APP_ROOT}/src/controller`);

class HellVoiceController extends Controller {
	constructor(hellBot) {
		super(hellBot);

		this.hellBot.server.router.post('/hellvoice', this.defaultAction.bind(this));
	}

	async defaultAction(req, res) {
		res.json({ hellvoice: 'true' });
	}
}

module.exports = HellVoiceController;
