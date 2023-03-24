import { Messages } from "#core/intl/Messages";

export default function translate<T extends { messages: Messages }>(
    this: T,
    locale: string,
    key: string,
    ...args: string[]
): string {
    let message = this.messages.get("source")?.get(key) ?? key;
    message = this.messages.get(locale)?.get(key) ?? message;

    for (const [idx, arg] of args.entries()) {
        message = message.replaceAll(`{${idx}}`, arg);
    }

    return message;
}
