import { Collection, Err, Ok, Result } from "unwrap";
import {
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  SlashCommandBuilder,
} from "discord";
import { ChatInputCommandHandler } from "./Command.ts";

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

  async loadFeatures() {
    for await (const feature of Deno.readDir(Deno.cwd() + "/features")) {
      if (feature.isDirectory) {
        const { default: featureModule } = await import(
          `../features/${feature.name}/index.ts`
        );
        this.register(featureModule.data, featureModule.handler);
      }
    }
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
