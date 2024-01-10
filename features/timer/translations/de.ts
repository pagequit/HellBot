import type { RawTranslation } from "/core/I18n.ts";

export default {
  description: () => "Antwortet mit 'Piep' nachdem der Timer abgelaufen ist.",
  beep: () => "Piep, der Timer ist abgelaufen.",
  minutes: () => "minuten",
  minutesDescription: () => "Minuten bis der Timer abgelaufen ist.",
  cancel: () => "Abbrechen",
  replySet: (minutes: string) => `Timer wurde auf ${minutes} minuten gestellt.`,
  replyCancel: () => "Timer wurde abgebrochen.",
  replyExeption: () =>
    "Timer muss zwischen 1 und 1440 minuten gestellt werden.",
} satisfies RawTranslation;
