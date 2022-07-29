export type HellConfig = {
	appContext: string;
	basedir: string;
	extensionsPaths: string[];
	discordConfig: {
		clientId: string,
		guildId: string,
		restVersion: string,
		token: string,
	},
	hedisConfig: {
		username: string,
		prefix: string,
		redisConfig: {
			url: string,
		},
	},
};
