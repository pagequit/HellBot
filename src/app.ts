#!/usr/bin/node
import 'dotenv/config';
import { Intents } from 'discord.js';
import { config } from '../hell.config';
import HellBot from './HellBot';

const hellBot = new HellBot(config, { intents: [Intents.FLAGS.GUILDS] });
hellBot.mountCommands();

hellBot.once('ready', client => {
	console.log(`Logged in as: ${client.user.tag}`);
});

hellBot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) {
		return;
	}

	const command = hellBot.commands.get(interaction.commandName);
	try {
		await command?.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'An error occurred!', ephemeral: true });
	}
});

hellBot.login(process.env.DISCORD_TOKEN);
