module.exports = {
	name: 'ping',
	info: 'pong',
	execute(args, message) {
		message.channel.send('pong');
	},
};