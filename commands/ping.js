module.exports = {
	name: 'ping',
	info: 'Ping!?',
	execute(message) {
		message.channel.send('pong!');
	},
};