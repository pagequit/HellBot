import type { RawTranslation } from "/core/I18n.ts";

export default {
  description: () => "Antwortet mit 'Piep' nachdem der Timer abgelaufen ist.",
  beep: () => "Piep, der Timer ist abgelaufen.",
  minutes: () => "minuten",
  minutesDescription: () => "Minuten bis der Timer abgelaufen ist.",
} satisfies RawTranslation;
