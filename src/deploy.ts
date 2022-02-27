import 'dotenv/config';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const { clientId, guildId } = {
	clientId: '592781082454130719',
	guildId: '350723544495292426',
};

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Should reply with pong.')
].map(command => command.toJSON());

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const token = process.env.DISCORD_TOKEN!;
const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.catch(console.error);
