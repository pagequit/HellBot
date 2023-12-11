import type { Locale } from "/core/i18n.ts";

export default {
  name: () => "ping",
  description: () => "Replies with Pong!",
  example: (arg: string) => `This is the ${arg}.`,
} satisfies Locale;
