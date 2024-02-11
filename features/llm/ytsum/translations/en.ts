import type { RawTranslation } from "/core/I18n.ts";

export default {
  name: () => "ytsum",
  description: () => "WIP",
  link: () => "link",
  linkDescription: () => "WIP",
  notAYouTubeLink: () => "Provided link is not a youtube link.",
  busy: () => "I'm busy please try again later.",
  noSubs: () => "Error, no subs found.",
  noLLM: () => "Error, no LLM response.",
} satisfies RawTranslation;
