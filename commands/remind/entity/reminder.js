function Reminder(data) {
	this.time = data.minutes * 60000;
	this.subject = data.subject;
	this.hellUser = data.hellUser;
}

Reminder.prototype = {
	start({ ext }) {
		return setTimeout(ext => {
			const user = ext.store.get('guild').members.cache
				.find(m => m.id === this.hellUser.id).user;

			user.send(ext.i18n.t(this.hellUser.locale, 'remind.default', [user.username, this.subject]));
		}, this.time, ext);
	},
}

module.exports = Reminder;
