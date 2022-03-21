import { createClient } from 'redis';

export default class HellStore {
	client: ReturnType<typeof createClient>;

	constructor(client: ReturnType<typeof createClient>) {
		this.client = client;
	}
}
