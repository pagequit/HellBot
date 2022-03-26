import * as fs from 'node:fs';
import { Messages } from './types';

export function translate<T extends { messages: Messages }>(this: T, locale: string, key: string, ...args: string[]): string {
	let message = this.messages.get('source')?.get(key) ?? key;
	message = this.messages.get(locale)?.get(key) ?? message;

	for (const [idx, arg] of args.entries()) {
		message = message.replace(`{${idx}}`, arg);
	}

	return message;
}

export async function loadMessages(dirname: string): Promise<Messages> {
	const messages: Messages = new Map();

	try {
		for (const name of fs.readdirSync(dirname).filter(m => m.endsWith('.js'))) {
			const entries = await import(`${dirname}/${name}`);
			const locale = name.replace('.js', '');

			messages.set(locale, new Map(Object.entries(entries.default)));
		}
	}
	catch(error) {
		console.error(1648293911336, error);
	}

	return messages;
}

export async function loadEntitiesFromIndex<E>(dirname: string, ...arg: unknown[]): Promise<Map<string, E>> {
	const entities = new Map();

	try {
		for (const name of fs.readdirSync(dirname)) {
			const Entity = await import(`${dirname}/${name}`);

			entities.set(name, new Entity.default(...arg));
		}
	}
	catch(error) {
		console.error(1648293911968, error);
	}

	return entities;
}
