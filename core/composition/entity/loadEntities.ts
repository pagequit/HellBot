import * as fs from 'node:fs';
import OptionMap from '#core/generics/OptionMap';

export default async function loadEntities<E>(dirname: string, ...arg: unknown[]): Promise<OptionMap<string, E>> {
	const entities = new OptionMap<string, E>();

	for (const name of fs.readdirSync(dirname)) {
		const Entity = await import(`${dirname}/${name}`);

		entities.set(name, new Entity.default(...arg));
	}

	return entities;
}
