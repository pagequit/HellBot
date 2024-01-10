import type { RawTranslation } from "/core/I18n.ts";

export default {
  name: () => "timer",
  description: () => "Responds with 'Beep' when the timer is up.",
  beep: () => "Beep, timer is up!",
  minutes: () => "minutes",
  minutesDescription: () => "Minutes to wait before the timer is up.",
  cancel: () => "Cancel",
  replySet: (minutes: string) => `Timer was set to ${minutes} minutes.`,
  replyCancel: () => "Timer was cancelled.",
  replyExeption: () => "Timer must be set between 1 and 1440 minutes.",
} satisfies RawTranslation;
