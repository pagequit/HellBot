const Extension = require(`${process.env.APP_ROOT}/src/extension`);
const Ctrl = require('./controller/hellvoice.ctrl');

class HellVoice extends Extension {
	mount(hellBot) {
		this.hellBot = hellBot;
		this.ctrl = new Ctrl(hellBot);
	}
}

module.exports = HellVoice;
