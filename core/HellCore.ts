import * as fs from "node:fs";
import {
    Client,
    GatewayIntentBits,
    Guild,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
    SlashCommandBuilder,
} from "discord.js";
import { HellConfig } from "../hell.config";
import { REST } from "@discordjs/rest";
import Hedis from "@pagequit/hedis";
import Option, { None, Some } from "@pagequit/hedis/dist/unwrap/option";
import Result, { Err, Ok } from "@pagequit/hedis/dist/unwrap/result";
import OMap from "@pagequit/hedis/dist/unwrap/OMap";
import Command from "#core/command/Command";
import Help from "#core/command/help/Help";
import { HellPlugin } from "#core/HellPlugin";
import DiscordInteractionHandler from "#core/interaction/DiscordInteractionHandler";
import HedisInteractionHandler from "#core/interaction/HedisInteractionHandler";

export default class HellCore {
    config: HellConfig;
    discord: { client: Client; guild: Option<Guild>; rest: REST };
    hedis: Hedis;
    commands: OMap<string, Command>;
    discordInteractionHandler: DiscordInteractionHandler;
    hedisInteractionHandler: HedisInteractionHandler;

    get redisClient(): typeof this.hedis.client {
        return this.hedis.client;
    }

    get discordClient(): typeof this.discord.client {
        return this.discord.client;
    }

    get guild(): Guild {
        return this.discord.guild.unwrap();
    }

    constructor(config: HellConfig) {
        this.config = config;

        const { restVersion, token } = config.discordConfig;

        this.discord = {
            client: new Client({ intents: [GatewayIntentBits.Guilds] }),
            guild: None(),
            rest: new REST({ version: restVersion }).setToken(token),
        };

        const { username, prefix, redisConfig } = config.hedisConfig;
        this.hedis = new Hedis(username, prefix, redisConfig);

        this.commands = new OMap();

        this.discordInteractionHandler = new DiscordInteractionHandler(this);
        this.hedisInteractionHandler = new HedisInteractionHandler();
    }

    async initialize(): Promise<void> {
        await this.hedis.init();
        this.hedis.listen(this.hedisInteractionHandler.handle);

        this.discordClient.once("ready", (client) => {
            this.discord.guild.insert(
                client.guilds.cache.find((guild) => {
                    return guild.id === this.config.discordConfig.guildId;
                }) as Guild
            );

            console.log(`Logged in as: '${client.user.tag}'.`);
        });

        this.discordClient.on(
            "interactionCreate",
            this.discordInteractionHandler.handle.bind(
                this.discordInteractionHandler
            )
        );

        this.registerCommand("help", new Help(this.commands));

        const { basedir, pluginsPath } = this.config.appConfig;
        await this.loadPlugins(`${basedir}/${pluginsPath}`)
            .then(async (plugins) => {
                await this.initializePlugins(plugins);
            })
            .catch((error) => {
                console.error(
                    `Unable to load plugins from: '${basedir}/${pluginsPath}'.`,
                    error
                );
            });

        await this.discordInteractionHandler.initialize();
    }

    registerCommand(
        name: string,
        command: Command
    ): Result<Promise<void>, Error> {
        if (this.commands.has(name)) {
            return Err(new Error(`Command '${name}' already exists!`));
        }
        this.commands.set(name, command);

        return Ok(command.initialize());
    }

    async loadPlugins(dirname: string): Promise<OMap<string, HellPlugin>> {
        const plugins = new OMap<string, Command>();

        for (const name of fs.readdirSync(dirname)) {
            const targetDir = `${dirname}/${name}`;

            if (fs.statSync(targetDir).isDirectory()) {
                const HellPlugin = await import(targetDir);
                plugins.set(name, new HellPlugin.default(dirname));
            }
        }

        return plugins;
    }

    async initializePlugins(
        plugins: OMap<string, HellPlugin>
    ): Promise<void[]> {
        return Promise.all(
            Array.from(plugins.values()).map((plugin: HellPlugin) =>
                plugin.initialize(this)
            )
        );
    }

    async login(): Promise<string> {
        return this.discordClient.login(this.config.discordConfig.token);
    }

    async deployCommands(): Promise<unknown[]> {
        const { clientId, guildId } = this.config.discordConfig;

        const distCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
            [];
        const distGuildCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] =
            [];

        for (const [_, command] of this.commands) {
            const buildCommand = command.slashCommandBuilder.toJSON();

            if (command.isPublic) {
                distCommands.push(buildCommand);
            } else {
                distGuildCommands.push(buildCommand);
            }
        }

        return Promise.all([
            this.discord.rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                {
                    body: distGuildCommands,
                }
            ),
            this.discord.rest.put(Routes.applicationCommands(clientId), {
                body: distCommands,
            }),
        ]);
    }
}
