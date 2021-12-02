const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const { clientId, guildId } = {
	clientId: '592781082454130719',
	guildId: '350723544495292426',
};

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Should reply with pong.')
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_KEY);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.catch(console.error);
