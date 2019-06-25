const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login(config.token);