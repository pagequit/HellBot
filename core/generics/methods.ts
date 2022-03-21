import { Messages } from './types';

export async function translate<T extends { messages: Messages }>(this: T, locale: string, key: string, ...args: string[]): Promise<string> {
	let message: string = this.messages.get('source.js')?.get(key) ?? key;
	message = this.messages.get(`${locale}.js`)?.get(key) ?? message;

	for (const [idx, arg] of args.entries()) {
		message = message.replace(`{${idx}}`, arg);
	}

	return message;
}
