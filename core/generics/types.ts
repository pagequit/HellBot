export type HellConfig = {
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

export type Messages = Map<string, Map<string, string>>;
