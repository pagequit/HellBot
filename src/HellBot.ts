import * as fs from 'node:fs';
import { Client, Intents } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Hedis from 'hedis';
import { HellConfig } from '../hell.config';
import BaseCommand from './abstracts/BaseCommand';

export default class HellBot {
	config: HellConfig;
	client: Client;
	rest: REST;
	hedis: Hedis;
	commands: Map<string, BaseCommand>;

	constructor(config: HellConfig) {
		this.config = config;

		this.client = new Client({
			intents: [Intents.FLAGS.GUILDS],
		});

		const { restVersion, token } = config.discordConfig;
		this.rest = new REST({
			version: restVersion,
		}).setToken(token);

		const { username, prefix, redisConfig } = config.hedisConfig;
		this.hedis = new Hedis(username, prefix, redisConfig);
	}

	async init(): Promise<void> {
		await this.loadCommands();

		this.hedis.on('message', async message => {
			console.log(message.content);
		});

		this.hedis.connect();

		this.client.once('ready', client => {
			console.log(`Logged in as: ${client.user.tag}`);
		});

		this.client.on('interactionCreate', async interaction => {
			if (!interaction.isCommand()) {
				return;
			}

			const command = this.commands.get(interaction.commandName);
			try {
				await command?.execute(interaction);
			}
			catch (error) {
				console.error(error);
				await interaction.reply({ content: 'An error occurred!', ephemeral: true });
			}
		});

		this.client.login(this.config.discordConfig.token);
	}

	async loadCommands(): Promise<void> {
		this.commands = new Map();
		const commandsDir = __dirname + '/commands';
		const commandsNames = fs.readdirSync(commandsDir);

		for (const name of commandsNames) {
			const Command = await import(`${commandsDir}/${name}`);
			this.commands.set(name, new Command.default());
		}
	}

	async deployCommands(): Promise<void> {
		// TODO
		const commands = [
			new SlashCommandBuilder().setName('ping').setDescription('Should reply with pong.')
		].map(command => command.toJSON());

		const { clientId, guildId } = this.config.discordConfig;
		this.rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
			.catch(console.error);
		// TODO
	}
}
