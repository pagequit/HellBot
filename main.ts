import HellCore from "/core/HellCore.ts";
import { botlog, discord } from "/config.ts";
import ping from "./features/ping/index.ts";
import timer from "./features/timer/index.ts";

import { registerSlashCommands } from "/core/procedures/registerSlashCommands.ts";

const hellBot = new HellCore({ botlog, discord });

hellBot.use(ping);
hellBot.use(timer);

registerSlashCommands(
  [...hellBot.chatInputCommands.values()].map((c) => c.data),
);

hellBot.login(discord.token);
