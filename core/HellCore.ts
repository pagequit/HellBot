import {
	Client,
	GatewayIntentBits,
	RoleManager,
	Routes,
	SlashCommandBuilder,
} from 'discord.js';
import { REST } from '@discordjs/rest';
import Hedis from 'hedis';
import Command from '#core/composition/entity/Command';
import { HellConfig } from '#core/types';
import Extension from '#core/composition/entity/Extension';
import loadEntities from '#core/composition/entity/loadEntities';
import OptionMap from '#core/generics/OptionMap';
import { Messages } from '#core/composition/i18n/Messages';
import DiscordInteractionHandler from '#core/composition/interaction/DiscordInteractionHandler';
import HedisInteractionHandler from '#core/composition/interaction/HedisInteractionHandler';

export default class HellCore {
	config: HellConfig;
	client: Client;
	rest: REST;
	hedis: Hedis;
	commands: OptionMap<string, Command>;
	messages: Messages;
	discordInteractionHandler: DiscordInteractionHandler;
	hedisInteractionHandler: HedisInteractionHandler;

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

		this.discordInteractionHandler = new DiscordInteractionHandler(this);
		this.hedisInteractionHandler = new HedisInteractionHandler(this);
	}

	sortGuildRoles(roles: RoleManager) {
		return roles.cache.sort((cur, nxt) => {
			return nxt.rawPosition - cur.rawPosition;
		});
	}

	async initialize(): Promise<void> {
		this.hedis.on('message', this.hedisInteractionHandler.handle.bind(this.hedisInteractionHandler));
		await this.hedis.connect();

		this.client.once('ready', client => {
			const { guildId } = this.config.discordConfig;
			const guild = client.guilds.cache.find(g => g.id === guildId);
			if (guild === undefined) {
				throw new Error(`Guild '${guildId}' not found!`);
			}

			this.sortGuildRoles(guild.roles);

			console.log(`Logged in as: '${client.user.tag}'.`);
		});
		this.client.on('interactionCreate', this.discordInteractionHandler.handle.bind(this.discordInteractionHandler));

		await this.loadCommands(__dirname + './../commands');
		await this.initializeCommands();

		const { basedir, extensionsPaths } = this.config;
		await this.loadExtensions(`${basedir}/${extensionsPaths}`).then(async extensions => {
			await this.initializeExtensions(extensions);
		}).catch(error => {
			console.error(`Unable to load extensions from: '${basedir}/${extensionsPaths}'.`, error);
		});

		this.deployCommands();

		this.client.login(this.config.discordConfig.token);
	}

	async registerCommand(name: string, command: Command): Promise<void> {
		if (this.commands.has(name)) {
			return Promise.reject(new Error(`Command '${name}' already exists!`));
		}

		this.commands.set(name, command);
		return command.initialize();
	}

	async loadCommands(dirname: string): Promise<void> {
		this.commands = await loadEntities<Command>(dirname, this);
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
			if (name === 'default') {
				continue;
			}

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
		return loadEntities<Extension>(dirname, this);
	}

	async initializeExtensions(extensions: OptionMap<string, Extension>): Promise<unknown[]> {
		return Promise.all(Array.from(extensions.values()).map(extension => extension.initialize(this)));
	}
}
