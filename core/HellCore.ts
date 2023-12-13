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
        return;
      }

      try {
        command.unwrap().execute(interaction);
      } catch (error) {
        this.logger.error(error.message, error);
      }
    });
  }

  use(feature: Feature): void {
    feature.setup(this);
  }

  addChatInputCommand(command: Command): Result<void, string> {
    if (this.chatInputCommands.has(command.data.name)) {
      const error = `Command ${command.data.name} already registered.`;
      this.logger.error(error);

      return Err(error);
    }
    this.chatInputCommands.set(command.data.name, command);

    return Ok(undefined);
  }

  login(token: string): Promise<string> {
    return this.client.login(token);
  }
}
