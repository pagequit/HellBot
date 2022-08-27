import { createClient } from 'redis';
import { Client, Repository } from 'redis-om';
import Option from '#core/generics/Option';
import HellUser, { hellUserSchema } from '#core/store/entities/HellUser';

export default class HellStore {
	client: Client;
	hellUsers: Repository<HellUser>;

	async setup(connection: ReturnType<typeof createClient>) {

		this.client = await new Client().use(connection);

		this.hellUsers = this.client.fetchRepository(hellUserSchema);

		await this.hellUsers.createIndex();

		// await this.hellUsers.createAndSave({
		// 	discordId: '12345',
		// 	username: 'test',
		// 	locale: 'en',
		// 	permissions: 0,
		// 	accessToken: 'test',
		// });

		// const hellUser = new Option<HellUser>(
		// 	await this.hellUsers.search()
		// 		.where('discordId').equals('12345').first()
		// );

		// console.log(hellUser.unwrap().username);
	}

	async findByDiscordId(discordId: string): Promise<Option<HellUser>> {
		return new Option(await this.hellUsers.search()
			.where('discordId').equals(discordId).first()
		);
	}

	async findByAccessToken(accessToken: string): Promise<Option<HellUser>> {
		return new Option(await this.hellUsers.search()
			.where('accessToken').equals(accessToken).first()
		);
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
