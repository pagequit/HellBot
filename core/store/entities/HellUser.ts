import { Entity, Schema } from 'redis-om';

export default class HellUser extends Entity {
	discordId: string;
	username: string;
	locale: string;
	permissions: number;
	accessToken: string;
}

export const hellUserSchema = new Schema(HellUser, {
	discordId: { type: 'string' },
	username: { type: 'string' },
	locale: { type: 'string' },
	permissions: { type: 'number' },
	accessToken: { type: 'string' },
});
