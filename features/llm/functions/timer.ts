import type { User } from "discord.js";
import { Collection } from "unwrap/mod.ts";
import type { Callable } from "../FunctionCall.ts";

const timers = new Collection<string, number>();

export const timer: Callable<{ time: number; user: User }, void> = ({
  time,
  user,
}: {
  time: number;
  user: User;
}): void => {
  const ms = time * 60 * 1000;
  const timer = ms + Date.now();

  timers.set(user.id, timer);

  user.send(`Timer set for ${time} minutes.`);
};
