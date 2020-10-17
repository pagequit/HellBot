function Reminder(data) {
	this.time = data.time;
	this.subject = data.subject;
	this.hellUser = data.hellUser;
}

Reminder.prototype = {
	start({ ext }, reminder) {
		return setTimeout(ext => {
			const user = ext.store.get('guild').members.cache
				.find(m => m.id === this.hellUser.id).user;

			user.send(ext.i18n.t(this.hellUser.locale, 'remind.default', [user.username, this.subject]));
			reminder.delete(this.hellUser.id);
		}, this.time, ext, reminder);
	},
}

module.exports = Reminder;
