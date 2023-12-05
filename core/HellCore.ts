import type { HellConfig } from "./HellConfig.ts";
import type { Command } from "./Command.ts";
import type { Feature } from "./Feature.ts";
import { Collection, Err, Ok, Result } from "unwrap";
import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  WebhookClient,
} from "discord";
import HellLog from "./HellLog.ts";

export default class HellCore {
  chatInputCommands: Collection<string, Command>;
  client: Client;
  logger: HellLog;

  constructor(config: HellConfig) {
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
      this.logger.log(`Logged in as ${client.user.tag}.`);
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

  async use(feature: Feature): Promise<void> {
    return await feature.setup(this);
  }

  addChatInputCommand(
    name: string,
    command: Command,
  ): Result<Collection<string, Command>, string> {
    if (this.chatInputCommands.has(name)) {
      return Err(`Command ${name} already registered.`);
    }

    return Ok(this.chatInputCommands.set(name, command));
  }

  login(token: string): Promise<string> {
    return this.client.login(token);
  }
}
