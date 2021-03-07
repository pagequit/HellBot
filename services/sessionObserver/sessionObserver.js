const Service = require('../../src/service');

class SessionObserver extends Service {
	init() {
		console.log('init');
		this.client.on('guildMemberUpdate', (oldMember, newMember) => {
			console.log(oldMember);
			console.log(newMember);
		});
	}
}

module.exports = SessionObserver;
