function CommandRejection(message, { reason, args }) {
	this.message = message;
	this.reason = reason;
	this.args = args;
}

CommandRejection.prototype.handle = function (hellBot) {
	const locale = hellBot.ext.prisma
		.getPrismaUserById(this.message.author.id).locale;

	this.message.reply(hellBot.ext.i18n.t(locale, this.reason, this.args));
}

module.exports = CommandRejection;
