import { Client, Intents, RoleManager } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Hedis from 'hedis';
import Command from '#core/abstracts/Command';
import { HellConfig } from '#core/generics/types';
import { loadEntitiesFromIndex } from './generics/methods';

export default class HellCore {
	config: HellConfig;
	client: Client;
	rest: REST;
	hedis: Hedis;
	commands: Map<string, Command>;

	get redis(): typeof this.hedis.client {
		return this.hedis.client;
	}

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

		this.commands = new Map();
	}

	sortGuildRoles(roles: RoleManager|undefined) {
		return roles?.cache.sort((cur, nxt) => {
			return nxt.rawPosition - cur.rawPosition;
		});
	}


	async init(): Promise<void> {
		await this.loadCommands();
		await this.initializeCommands();


		this.hedis.on('message', async message => {
			console.log(message.content);
		});

		await this.hedis.connect();

		this.client.once('ready', client => {
			const { guildId } = this.config.discordConfig;
			const roles = client.guilds.cache.find(g => g.id === guildId)?.roles;
			this.sortGuildRoles(roles);
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
				console.error(1648293912239, error);
				await interaction.reply({ content: 'An error occurred!', ephemeral: true });
			}
		});

		await this.client.login(this.config.discordConfig.token);

		await this.deployCommands();
	}

	async registerCommand(name: string, commandInstance: Command): Promise<unknown> {
		this.commands.set(name, commandInstance);

		return this.deployCommands();
	}

	async loadCommands(): Promise<void> {
		const commandsDir = __dirname + '/commands';
		this.commands = await loadEntitiesFromIndex(commandsDir);
	}

	async initializeCommands(): Promise<void> {
		for (const commandEntry of this.commands) {
			await commandEntry[1].init(this);
		}
	}

	async deployCommands(): Promise<unknown> {
		const { clientId, guildId } = this.config.discordConfig;

		const distCommands = [];
		for (const [name, command] of this.commands) {
			distCommands.push(
				new SlashCommandBuilder()
					.setName(name)
					.setDescription(command.description)
					.toJSON()
			);
		}

		return this.rest.put(Routes.applicationGuildCommands(clientId, guildId), {
			body: distCommands,
		});
	}
}
