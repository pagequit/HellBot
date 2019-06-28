module.exports = {
	name: 'wakeup',
	info: 'Let a sleeping bot awake.',
	execute(message) {
		if ( message.member.roles.exists('name', '@admin') ) {
			message.channel.send('Here I am!');
		}
	},
};