import { Collection, Err, Ok, Result } from "unwrap";
import {
  ChatInputCommandInteraction,
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
  chatInputCommandHandlers: Collection<
    string,
    (interactin: ChatInputCommandInteraction) => Result<void, string>
  >;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });
    this.chatInputCommandHandlers = new Collection();

    this.client.once(Events.ClientReady, (client: Client<true>) => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      this.chatInputCommandHandlers.get(
        interaction.commandName,
      ).getOrInsertWith(() => () =>
        Err(`Command ${interaction.commandName} not found.`)
      )(interaction).isErrAnd((err) => {
        interaction.reply({ content: err }).catch((error) => {
          console.error(error);
        });

        return true;
      });
    });
  }

  async loadFeatures(path: string) {
    for await (const feature of Deno.readDir(path)) {
      if (feature.isDirectory) {
        const { default: featureModule }: { default: Feature<Command> } =
          await import(
            `${path}/${feature.name}/index.ts`
          );
        this.register(featureModule.data, featureModule.handler);
      }
    }
  }

  async registerCommands() {
    await registerSlashCommands([...this.chatInputCommandHandlers.keys()]); // FIXME
  }

  register(
    data: SlashCommandBuilder,
    handler: ChatInputCommandHandler,
  ): Result<void, string> {
    if (this.chatInputCommandHandlers.has(data.name)) {
      return Err(`Command ${data.name} already registered.`);
    }

    this.chatInputCommandHandlers.set(data.name, handler);
    return Ok(undefined);
  }

  login(token: string) {
    this.client.login(token);
  }
}
