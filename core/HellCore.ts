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
import Message from 'hedis/src/classes/Message';
import Command from '#core/abstracts/Command';
import { HellConfig } from '#core/generics/types';
import { Extension } from '#core/generics/interfaces';
import { loadEntities } from '#core/generics/methods';
import OptionMap from '#core/generics/OptionMap';
import Ping from './commands/ping/Ping';

export default class HellCore {
	config: HellConfig;
	client: Client;
	rest: REST;
	hedis: Hedis;
	commands: OptionMap<string, Command>;

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


		this.hedis.on('message', async (message: Message) => {
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

			command.unwrapOrElse(() => {
				return new Ping(this); // TODO: Create a fallback command that executes a help command instead
			}).execute(interaction).catch(error => {
				console.error(1648293912239, error);
				interaction.reply({ content: 'An error occurred!', ephemeral: true });
			});

			// try {
			// 	await command?.execute(interaction);
			// }
			// catch (error) {
			// 	console.error(1648293912239, error);
			// 	await interaction.reply({ content: 'An error occurred!', ephemeral: true });
			// }
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
		return command.initialize();
	}

	async loadCommands(dirname: string): Promise<void> {
		this.commands = await loadEntities<Command>(dirname);
	}

	async initializeCommands(): Promise<void> {
		for (const command of this.commands.values()) {
			await command.initialize();
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

	async loadExtensions(dirname: string): Promise<OptionMap<string, Extension>> {
		return loadEntities<Extension>(dirname);
	}

	async initializeExtensions(extensions: OptionMap<string, Extension>): Promise<void> {
		for (const extension of extensions.values()) {
			try {
				await extension.initialize(this);
			}
			catch (error) {
				console.error('init 4 real!11', error);
			}
		}
	}
}
