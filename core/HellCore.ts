import { Collection, Err, Result } from "unwrap";
import {
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
} from "discord";

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

  login(token: string) {
    this.client.login(token);
  }
}
