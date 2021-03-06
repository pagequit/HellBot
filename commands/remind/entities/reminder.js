function Reminder({ time, subject, guildMember, locale }) {
	this.time = time;
	this.subject = subject;
	this.guildMember = guildMember;
	this.locale = locale;
}

Reminder.prototype = {
	start({ ext }, reminder) {
		return setTimeout(ext => {
			this.guildMember.send(
				ext.i18n.t(this.locale, 'remind.default', [this.guildMember.displayName, this.subject])
			);
			reminder.delete(this.guildMember.id);
		}, this.time, ext, reminder);
	},
}

module.exports = Reminder;
