import { Collection, Err, Ok, Result } from "unwrap";
import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  SlashCommandBuilder,
} from "discord";
import { ChatInputCommandHandler, Command } from "./Command.ts";
import { registerSlashCommands } from "./procedures/registerSlashCommands.ts";
import { Feature } from "./Feature.ts";

export default class HellCore {
  client: Client;
  chatInputCommands: Collection<
    string,
    {
      data: SlashCommandBuilder;
      handler: ChatInputCommandHandler;
    }
  >;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });
    this.chatInputCommands = new Collection();

    this.client.once(Events.ClientReady, (client: Client<true>) => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const result = this.chatInputCommands.get(
        interaction.commandName,
      ).map(({ handler }) => handler(interaction)).okOr(
        `Command ${interaction.commandName} not found.`,
      ).flatten();

      if (result.isErr()) {
        console.error(result.unwrapErr());
      }
    });
  }

  async loadFeatures(path: string) {
    for await (const feature of Deno.readDir(path)) {
      if (feature.isDirectory) {
        const { default: featureModule }: { default: Feature<Command> } =
          await import(
            `${path}/${feature.name}/index.ts`
          );
        this.register(featureModule.data.name, {
          data: featureModule.data,
          handler: featureModule.handler,
        });
      }
    }
  }

  async registerCommands() {
    await registerSlashCommands(
      [...this.chatInputCommands.map(({ data }) => data).values()],
    );
  }

  register(
    name: string,
    { data, handler }: {
      data: SlashCommandBuilder;
      handler: ChatInputCommandHandler;
    },
  ): Result<void, string> {
    if (this.chatInputCommands.has(name)) {
      return Err(`Command ${name} already registered.`);
    }

    this.chatInputCommands.set(name, { data, handler });
    return Ok(undefined as never); // FIXME
  }

  login(token: string) {
    this.client.login(token);
  }
}
