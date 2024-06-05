import { serverURL } from "@/config.ts";
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
import { http } from "@/core/http/http.ts";
import { loadFeatures } from "@/core/loadFeatures";
import { staticPlugin } from "@elysiajs/static";
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
    logger.log(`${interaction.commandName}`, interaction.commandName); // DELETEME
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

// client.login(process.env.DISCORD_TOKEN as string);

http
  .use(
    staticPlugin({
      assets: `${process.cwd()}/frontend/dist`,
      prefix: "/",
    }),
  )
  .listen(process.env.SERVER_PORT);
logger.log(`Listening on port ${process.env.SERVER_PORT}.`);

// await removeAllSlashCommands();
// deployApplicationCommands([...chatInputCommands.map((c) => c.data).values()]);
// deployApplicationGuildCommands([
//   ...chatInputGuildCommands.map((c) => c.data).values(),
// ]);
