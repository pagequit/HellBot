import * as fs from 'node:fs';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Messages } from '#core/generics/types';
import { createClient } from 'redis';
import { translate } from '#core/generics/methods';

export default abstract class BaseCommand {
	dirname: string;
	data = new SlashCommandBuilder();
	icon: string;
	name: string;
	messages: Messages;
	$redis: ReturnType<typeof createClient>;
	$t: typeof translate;

	constructor(dirname: string) {
		this.dirname = dirname;
	}

	async init(redis: typeof this.$redis) {
		this.$redis = redis;

		const messagesDir = this.dirname + '/messages';
		const messagesFiles: string[] = [];

		try {
			messagesFiles.push(...fs.readdirSync(messagesDir));
		}
		catch(error) {
			console.error(1647859179720, error);
		}

		this.messages = new Map();

		for (const name of messagesFiles.filter(m => m.endsWith('.js'))) {
			const messages = await import(`${messagesDir}/${name}`);
			this.messages.set(name, messages.default);
		}
	}

	abstract execute(interaction: CommandInteraction): Promise<void>;
}

BaseCommand.prototype.$t = translate;
