import type { Result } from "unwrap";
import type { CommandDTO } from "./Command.ts";

export type Feature = {
  register: (
    register: (command: CommandDTO) => Result<void, string>,
  ) => Result<void, string>;
};
