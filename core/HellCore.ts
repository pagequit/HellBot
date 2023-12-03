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
  chatInputCommands: Collection<string, Command>;
  client: Client;
  logger: HellLog;

  constructor({ botlog }: { botlog: { id: string; token: string } }) {
    this.chatInputCommands = new Collection();

    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });

    this.logger = new HellLog(
      new WebhookClient({
        id: botlog.id,
        token: botlog.token,
      }),
    );

    this.client.once(Events.ClientReady, (client: Client<true>) => {
      console.log(`Logged in as ${client.user.tag}`);
    });

    this.client.on(Events.InteractionCreate, (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      const command = this.chatInputCommands.get(interaction.commandName);

      if (command.isNone()) {
        console.error(`Command ${interaction.commandName} not found.`);
      }

      try {
        command.unwrap().handle(interaction);
      } catch (error) {
        console.error(error);
      }
    });
  }

  async loadFeatures(path: string) {
    for await (const feature of Deno.readDir(path)) {
      if (feature.isDirectory) {
        const { default: featureModule }: { default: Command } = await import(
          `${path}/${feature.name}/index.ts`
        );
        this.register(featureModule.data.name, featureModule);
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
    command: Command,
  ): Result<Collection<string, Command>, string> {
    if (this.chatInputCommands.has(name)) {
      return Err(`Command ${name} already registered.`);
    }

    return Ok(this.chatInputCommands.set(name, command));
  }

  login(token: string) {
    this.client.login(token);
  }
}
