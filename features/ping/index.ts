import type HellCore from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import { I18n } from "/core/I18n.ts";
import { Collection } from "unwrap";
import Ping from "./Ping.ts";
import defaults from "./translations/defaults.ts";
import de from "./translations/de.ts";

export default {
  setup(core: HellCore): void {
    core.addChatInputCommand(
      new Ping(
        new I18n(Collection.from([
          ["en-GB", defaults],
          ["en-US", defaults],
          ["de", de],
        ])),
      ),
    );
  },
} satisfies Feature;
