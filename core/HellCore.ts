import {
	Client,
	GatewayIntentBits,
	InteractionType,
	RoleManager,
	Routes,
	SlashCommandBuilder,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import Hedis from 'hedis';
import Command from '#core/abstracts/Command';
import { HellConfig } from '#core/generics/types';
import { Extension } from './generics/interfaces';
import { loadEntities } from './generics/methods';


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
			intents: [GatewayIntentBits.Guilds],
		});

		const { restVersion, token } = config.discordConfig;
		this.rest = new REST({
			version: restVersion,
		}).setToken(token);

		const { username, prefix, redisConfig } = config.hedisConfig;
		this.hedis = new Hedis(username, prefix, redisConfig);

		this.commands = new Map();
	}

	sortGuildRoles(roles: RoleManager) {
		return roles.cache.sort((cur, nxt) => {
			return nxt.rawPosition - cur.rawPosition;
		});
	}


	async initialize(): Promise<void> {
		await this.loadCommands(__dirname + '/commands');
		await this.initializeCommands();


		this.hedis.on('message', async message => {
			console.log(message.content);
		});

		await this.hedis.connect();

		this.client.once('ready', client => {
			const { guildId } = this.config.discordConfig;
			const guild = client.guilds.cache.find(g => g.id === guildId);
			if (guild === undefined) {
				throw new Error(`Guild ${guildId} not found!`);
			}

			this.sortGuildRoles(guild.roles);

			console.log(`Logged in as: ${client.user.tag}`);
		});

		this.client.on('interactionCreate', async interaction => {
			if (!(interaction.type === InteractionType.ApplicationCommand)) {
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

		const { basedir, extensionsPaths } = this.config;

		await this.loadExtensions(`${basedir}/${extensionsPaths}`).then(extensions => {
			this.initializeExtensions(extensions);
		}).catch(error => {
			console.error('load', error);
		});

	}

	async registerCommand(name: string, command: Command): Promise<void> {
		if (this.commands.has(name)) {
			return Promise.reject(new Error(`Command ${name} already exists!`));
		}

		this.commands.set(name, command);
		return command.initialize(this);
	}

	async loadCommands(dirname: string): Promise<void> {
		this.commands = await loadEntities<Command>(dirname);
	}

	async initializeCommands(): Promise<void> {
		for (const commandEntry of this.commands) {
			await commandEntry[1].initialize(this);
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

	async loadExtensions(dirname: string): Promise<Map<string, Extension>> {
		return loadEntities<Extension>(dirname);
	}

	async initializeExtensions(extensions: Map<string, Extension>): Promise<void> {
		for (const extension of extensions) {
			try {
				await extension[1].initialize(this);
			}
			catch (error) {
				console.error('init 4 real!11', error);
			}
		}
	}
}
