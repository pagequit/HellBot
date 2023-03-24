import * as fs from "node:fs";
import { Messages } from "#core/intl/Messages";

export default async function loadMessages(
    dirname: string,
    messages: Messages
): Promise<Messages> {
    for (const name of fs
        .readdirSync(dirname)
        .filter((m) => m.endsWith(".js"))) {
        const entries = await import(`${dirname}/${name}`);
        const locale = name.replace(".js", "");

        messages.set(locale, new Map(Object.entries(entries.default)));
    }

    return messages;
}
