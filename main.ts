import { discord } from "@/config.ts";
import {
  chatInputCommands,
  chatInputGuildCommands,
} from "@/core/discord/chatInputCommands.ts";
import { client } from "@/core/discord/client.ts";
import {
  deployApplicationCommands,
  deployApplicationGuildCommands,
  removeAllSlashCommands,
} from "@/core/discord/deployCommands.ts";
import { logger } from "@/core/discord/logger.ts";
import { http } from "@/core/http.ts";
import { loadFeatures } from "@/core/loadFeatures";
import { type Client, Events, type Interaction } from "discord.js";

client.once(Events.ClientReady, (client: Client<true>) => {
  logger.log(`Logged in as ${client.user.tag}.`);
});

client.on(Events.InteractionCreate, (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = chatInputCommands
    .get(interaction.commandName)
    .or(chatInputGuildCommands.get(interaction.commandName));
  if (command.isNone()) {
    logger.error(`Command '${interaction.commandName}' not found.`);
    return;
  }

  try {
    command.unwrap().execute(interaction);
  } catch (error) {
    logger.error((error as Error).message, error);
  }
});

for (const feature of await loadFeatures(`${process.cwd()}/features`)) {
  try {
    feature();
  } catch (error) {
    logger.error((error as Error).message, error);
  }
}

// TODO: remove config.ts and use prosess.env directly
client.login(discord.token);
http.listen(8080);

// await removeAllSlashCommands();
// deployApplicationCommands([...chatInputCommands.map((c) => c.data).values()]);
// deployApplicationGuildCommands([
//   ...chatInputGuildCommands.map((c) => c.data).values(),
// ]);
