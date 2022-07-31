import { createClient } from 'redis';
import { Entity, Schema, Client, Repository } from 'redis-om';
import Option from '#core/generics/Option';


class Person extends Entity {}


export default class HellStore {
	client: Client;
	personRepository: Repository<Person>;

	async setup(connection: ReturnType<typeof createClient>) {

		this.client = await new Client().use(connection);

		const personSchema = new Schema(Person, {
			firstName: { type: 'string' },
			lastName: { type: 'string' },
			age: { type: 'number' },
			verified: { type: 'boolean' },
			locationUpdated: { type: 'date' },
			skills: { type: 'string[]' },
			personalStatement: { type: 'text' }
		});

		this.personRepository = this.client.fetchRepository(personSchema);

		await this.personRepository.createIndex(); // requires RediSearch
		// TODO: install RediSearch -__-

		const person = await this.personRepository.createAndSave({
			firstName: 'John',
			lastName: 'Doe',
			age: 30,
			verified: true,
			locationUpdated: new Date(),
			skills: ['JavaScript', 'TypeScript'],
			personalStatement: 'I am a developer'
		});

		console.log(person);

	}

	get(key: string): Promise<Option<unknown>> {
		return Promise.resolve(new Option('TODO'));
	}

	data() {
		//
	}

	mutations() {
		//
	}
}
