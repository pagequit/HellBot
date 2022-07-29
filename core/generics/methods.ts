import * as fs from 'node:fs';
import { Messages } from './types';


export function translate<T extends { messages: Messages }>(this: T, locale: string, key: string, ...args: string[]): string {
	let message = this.messages.get('source')?.get(key) ?? key;
	message = this.messages.get(locale)?.get(key) ?? message;

	for (const [idx, arg] of args.entries()) {
		message = message.replaceAll(`{${idx}}`, arg);
	}

	return message;
}

export async function loadMessages(dirname: string): Promise<Messages> {
	const messages: Messages = new Map();

	for (const name of fs.readdirSync(dirname).filter(m => m.endsWith('.js'))) {
		const entries = await import(`${dirname}/${name}`);
		const locale = name.replace('.js', '');

		messages.set(locale, new Map(Object.entries(entries.default)));
	}

	return messages;
}

export async function loadEntities<E>(dirname: string, ...arg: unknown[]): Promise<Map<string, E>> {
	const entities = new Map();

	for (const name of fs.readdirSync(dirname)) {
		const Entity = await import(`${dirname}/${name}`);

		entities.set(name, new Entity.default(...arg));
	}

	return entities;
}
