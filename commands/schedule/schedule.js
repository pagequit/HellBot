const Command = require('../../src/command');
const emoji = require('node-emoji');

class Schedule extends Command {
	constructor() {
		super();
		this.trigger.push('schedule');
		this.icon = ':calendar:';
	}

	async execute(args, message) {
		// Step 1: Parse the user's input
		const datetimeList = args[0].split(',');

		// Step 2: Generate a list of responses
		const responses = datetimeList.map(datetime => {
			const emojiPrefix = emoji.random().emoji;
			return `${emojiPrefix} ${datetime}`;
		});

		// Step 3: Send the responses
		const responseMessage = await message.channel.send(responses.join('\n'));

		// Step 4: Add reactions to the message
		for (const response of responses) {
			const emojiPrefix = response.split(' ')[0];
			await responseMessage.react(emojiPrefix);
		}
	}
}

module.exports = Schedule;