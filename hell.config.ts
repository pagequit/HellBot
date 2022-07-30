import { HellConfig } from '#core/types';

export const config: HellConfig = {
	appContext: `${process.env.APP_CONTEXT}`,
	basedir: __dirname,
	extensionsPaths: [
		'./extensions',
	],
	discordConfig: {
		clientId: '592781082454130719',
		guildId: '350723544495292426',
		restVersion: '9',
		token: `${process.env.DISCORD_TOKEN}`,
	},
	hedisConfig: {
		username: 'HellBot',
		prefix: 'hedis',
		redisConfig: {
			url: `${process.env.REDIS_URL}`,
		},
	},
};
