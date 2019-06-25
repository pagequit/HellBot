const Discord = require('discord.js');
const HellBot = require('./hellbot');
const config = require('./config.json');

const client = new Discord.Client();
const bot = new HellBot(config);

bot.command.ping = (message) => {
	message.channel.send('pong!');
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if ( message.content.startsWith(bot.config.prefix) ) {
		try {
			const command = message.content.split(' ', 1)[0].substr(1);
			bot.command[command](message);
		}
		catch (error) {
			console.log(error);
			message.reply(`Unknown command: '${message}'`);
		}
  }
});

client.login(bot.config.token);