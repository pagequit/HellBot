import "std/dotenv/load.ts";
import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord";

export default class HellCore {
  client: Client;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
    });

    this.client.once(Events.ClientReady, async (client: Client<true>) => {
      await this.client.guilds.cache.first()!.members.fetch();
      console.log(`Logged in as ${client.user.tag}`);
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      if (interaction.commandName === "wichtel") {
        interaction.options.get("wichtel")?.value?.toString().split(" ")
          .forEach((wichtel) => {
            const match = interaction.guild?.members.cache.find((member) =>
              member.displayName === wichtel
            );
            console.log(match);

            if (match) {
              match.user.send("ACK");
            }
          });

        interaction.reply("ACK");
      }
    });
  }

  login(token: string) {
    this.client.login(token);
    registerSlashCommands();
  }
}

async function registerSlashCommands() {
  const rest = new REST({ version: "10" }).setToken(
    `${Deno.env.get("DISCORD_TOKEN")}`,
  );

  try {
    console.log("Started refreshing application (/) commands.");

    const commands = [
      new SlashCommandBuilder()
        .setName("wichtel")
        .setDescription("Does the wichtel stuff.")
        .addStringOption((option) =>
          option
            .setName("wichtel")
            .setDescription("Wichtel")
            .setRequired(true)
        ),
    ];

    await rest.put(
      Routes.applicationCommands(
        `${Deno.env.get("HELLBOT_ID")}`,
      ),
      {
        body: commands,
      },
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
