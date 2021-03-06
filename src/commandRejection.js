function CommandRejection(message, { reason, args }) {
	this.message = message;
	this.reason = reason;
	this.args = args;
}

CommandRejection.prototype.handle = function (hellBot) {
	hellBot.ext.prisma.getPrismaUserById(this.message.author.id)
		.then(prismaUser => {
			this.message.reply(hellBot.ext.i18n.t(prismaUser.locale, this.reason, this.args));
		})
		.catch(error => {
			console.error(error);
		});
}

module.exports = CommandRejection;
