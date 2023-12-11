import type HellCore from "/core/HellCore.ts";
import type { Feature } from "/core/Feature.ts";
import { Locale } from "discord";
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
          [Locale.EnglishUS, defaults],
          [Locale.EnglishGB, defaults],
          [Locale.German, de],
        ])),
      ),
    );
  },
} satisfies Feature;
