module.exports = {
	name: 'sleep',
	info: 'Makes the bot unresponsive until someone wakes them up.',
	execute(message) {
		if ( message.member.roles.exists('name', '@admin') ) {
			message.channel.send('good night...');
		}
	},
};