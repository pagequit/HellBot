module.exports = {
	name: 'ping',
	info: 'pong',
	execute(message) {
		message.channel.send('pong');
	},
};