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

    this.client.on("interactionCreate", (interaction) => {
      if (!interaction.isChatInputCommand()) {
        return;
      }

      if (interaction.commandName === "wichtel") {
        const list = interaction.options.get("wichtel")!.value!.toString()
          .split(" ");
        const length = list.length;
        const pairs = [];
        let pair = [];

        for (let i = 0; i < length; i++) {
          pair.push(...list.splice(Math.floor(Math.random() * list.length), 1));

          if (pair.length > 1) {
            pairs.push(pair);
            pair = [];
          }
        }

        for (const [a, b] of pairs) {
          // console.log(a, b);
          const memberA = interaction.guild?.members.cache.find((member) => {
            return member.displayName === a;
          });
          const memberB = interaction.guild?.members.cache.find((member) => {
            return member.displayName === b;
          });

          if (memberA && memberB) {
            memberA.user.send(memberB.displayName);
            memberB.user.send(memberA.displayName);
          } else {
            interaction.user.send(`Meh, ${a} or ${b} are not on the server.`);
          }
        }
      }
    });
  }

  login(token: string) {
    this.client.login(token);
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
