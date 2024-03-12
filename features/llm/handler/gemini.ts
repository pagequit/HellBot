import type Chat from "../Chat.ts";
import type { ChatBody } from "../ChatBody.ts";

export function geminiProxyCall(
	sessionId: string,
	content: string,
): Promise<ChatBody> {
	return fetch("http://protonwire:8000", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			sessionId,
			content,
		}),
	}).then((res) => res.json() as Promise<ChatBody>);
}

export default async function (chat: Chat): Promise<string> {
	const response = await geminiProxyCall(
		chat.sessionId,
		chat.context[chat.context.length - 1].content,
	);

	return response.content;
}
