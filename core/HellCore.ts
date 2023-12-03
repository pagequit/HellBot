import type { HellConfig } from "./HellConfig.ts";
import type { Command } from "./Command.ts";
import { Collection, Err, Ok, Result } from "unwrap";
import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  WebhookClient,
} from "discord";
import { registerSlashCommands } from "./procedures/registerSlashCommands.ts";
import HellLog from "./HellLog.ts";

export default class HellCore {
  private config: HellConfig;
  private chatInputCommands: Collection<string, Command>;

  public client: Client;
  public logger: HellLog;

  constructor(config: HellConfig) {
    this.config = config;
    this.chatInputCommands = new Collection();

    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });

    this.logger = new HellLog(
      new WebhookClient({
        id: config.botlog.id,
        token: config.botlog.token,
      }),
    );

    this.client.once(Events.ClientReady, (client: Client<true>) => {
      this.logger.log(`Logged in as ${client.user.tag}`);
    });

    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const command = this.chatInputCommands.get(interaction.commandName);

      if (command.isNone()) {
        this.logger.error(`Command ${interaction.commandName} not found.`);
      }

      try {
        command.unwrap().handle(interaction);
      } catch (error) {
        this.logger.error(error.message, error);
      }
    });
  }

  public async init(): Promise<void> {
    await this.loadFeatures(this.config.path.features);
    await this.registerCommands();
    await this.login(this.config.discord.token);
  }

  private async loadFeatures(path: string) {
    for await (const feature of Deno.readDir(path)) {
      if (feature.isDirectory) {
        const modulePath = `${path}/${feature.name}/index.ts`;
        const { default: featureModule }: { default: Command } = await import(
          modulePath
        );
        this.register(featureModule.data.name, featureModule);
      }
    }
  }

  private async registerCommands() {
    await registerSlashCommands(
      [...this.chatInputCommands.map(({ data }) => data).values()],
    );
  }

  private register(
    name: string,
    command: Command,
  ): Result<Collection<string, Command>, string> {
    if (this.chatInputCommands.has(name)) {
      return Err(`Command ${name} already registered.`);
    }

    return Ok(this.chatInputCommands.set(name, command));
  }

  private login(token: string): Promise<string> {
    return this.client.login(token);
  }
}
