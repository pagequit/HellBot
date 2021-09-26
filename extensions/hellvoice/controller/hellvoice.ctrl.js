const Controller = require(`${process.env.APP_ROOT}/src/controller`);

class HellVoiceController extends Controller {
	constructor(hellBot) {
		super(hellBot);
	}

	print() {
		console.log(this);
	}
}

module.exports = HellVoiceController;
