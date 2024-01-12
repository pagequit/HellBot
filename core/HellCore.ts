import { type Command } from "./Command.ts";
import { Client, Events, GatewayIntentBits, Interaction } from "discord";
import { Collection, Err, Ok, Result } from "unwrap";
import { deleteSlashCommands } from "./procedures/deleteSlashCommands.ts";
import {
  registerCommands,
  registerGuildCommands,
} from "./procedures/registerSlashCommands.ts";
import { type HellLogger } from "./HellLog.ts";

export type Core = {
  client: HellCore["client"];
  logger: HellCore["logger"];
  addChatInputGuildCommand: HellCore["addChatInputGuildCommand"];
  addChatInputCommand: HellCore["addChatInputCommand"];
};

export default class HellCore {
  chatInputCommands: Collection<string, Command>;
  chatInputGuildCommands: Collection<string, Command>;
  logger: HellLogger;
  client: Client;

  constructor(logger: HellLogger) {
    this.chatInputCommands = new Collection();
    this.chatInputGuildCommands = new Collection();
    this.logger = logger;

    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });

    this.client.once(Events.ClientReady, (client: Client<true>) => {
      // this.logger.log(`Logged in as ${client.user.tag}.`);
      console.log(`Logged in as ${client.user.tag}.`);
    });

    // I don't know when that happens, but the API has this event.
    // (Onces it happens, we will see it in the botlog)
    this.client.on(Events.Warn, (info: string) => {
      this.logger.warn(info);
    });

    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const command = this.chatInputCommands.get(interaction.commandName).or(
        this.chatInputGuildCommands.get(interaction.commandName),
      );
      if (command.isNone()) {
        this.logger.error(`Command '${interaction.commandName}' not found.`);
        return;
      }

      try {
        command.unwrap().execute(interaction);
      } catch (error) {
        this.logger.error(error.message, error);
      }
    });
  }

  async setup(): Promise<HellCore> {
    await this.loadFeatures();

    // await deleteSlashCommands();

    // await registerCommands([
    //   ...this.chatInputCommands.map((c) => c.data).values(),
    // ]);
    // await registerGuildCommands([
    //   ...this.chatInputGuildCommands.map((c) => c.data).values(),
    // ]);

    return this;
  }

  async loadFeatures(path = `${Deno.cwd()}/features`): Promise<void> {
    for await (const dir of Deno.readDir(path)) {
      if (!dir.isDirectory) {
        continue;
      }

      const feature = (await import(`${path}/${dir.name}/index.ts`)).default;
      try {
        feature.setup(
          {
            client: this.client,
            logger: this.logger,
            addChatInputGuildCommand: this.addChatInputGuildCommand.bind(this),
            addChatInputCommand: this.addChatInputCommand.bind(this),
          } satisfies Core,
        );
      } catch (error) {
        this.logger.error(error.message, error);
      }
    }
  }

  addChatInputGuildCommand(command: Command): Result<void, string> {
    if (this.chatInputGuildCommands.has(command.data.name)) {
      const error = `Guild command '${command.data.name}' already registered.`;
      this.logger.error(error);

      return Err(error);
    }
    this.chatInputGuildCommands.set(command.data.name, command);

    return Ok(undefined);
  }

  addChatInputCommand(command: Command): Result<void, string> {
    if (this.chatInputCommands.has(command.data.name)) {
      const error = `Command '${command.data.name}' already registered.`;
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
