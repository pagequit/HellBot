/// <reference lib="dom" />

import { type ChatInputCommandInteraction } from "discord";
import { I18n, Locale } from "/core/I18n.ts";
import de from "./translations/de.ts";
import en from "./translations/en.ts";
import { type Command } from "/core/Command.ts";

const i18n = new I18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

function decodeHtml(html: string) {
    const textarea = window.document.createElement("textarea"); // FIXME
    textarea.innerHTML = html;

    return textarea.value;
}

function getSubsUrl(url: URL) {
  return fetch(url).then((res) => res.text()).then((text) => {
    return text.match(/"(https:\/\/www\.youtube\.com\/api\/timedtext.+?)"/)![1] // FIXME
            .replaceAll("\\u0026", "&");
  });
}

async function getSubs(url: URL) {
  return fetch(await getSubsUrl(url)).then((res) => res.text()).then((text) => {
    return decodeHtml(
            new DOMParser()
                .parseFromString(text, "text/xml").querySelector("transcript")!.textContent! // FIXME
        );
  });
}

// console.log(await getSubs("https://www.youtube.com/watch?v=uYXlgZKdsFM"));

export default {
  data: i18n.buildSlashCommand()
    .withName("name")
    .withDescription("description")
    .withStringOption("link", "linkDescription", true),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { user, locale, options } = interaction;
    const link = new URL(options.getString("link", true));
    const subs = await getSubs(link).catch(console.error);
  },
} satisfies Command;
