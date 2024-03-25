import type { RawTranslation } from "@/core/i18n/I18n.ts";

export default {
	name: () => "timer",
	description: () => "Responds with 'Beep' when the timer is up.",
	beep: () => "Beep, timer is up!",
	minutes: () => "minutes",
	minutesDescription: () => "Minutes to wait before the timer is up.",
	cancel: () => "Cancel",
	replySet: (time: string) => `Timer beeps ${time}.`,
	replyCancel: () => "Timer has been cancelled.",
	replyIsUp: () => "Timer is up.",
	replyExeption: () => "Timer must be set between 1 and 1440 minutes.",
	replyAlreadySet: (minutes: string, seconds: string) =>
		`Timer already set with ${minutes} minutes and ${seconds} seconds remaining.`,
} satisfies RawTranslation;
