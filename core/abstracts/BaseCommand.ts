import * as fs from 'node:fs';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default abstract class BaseCommand {
	dirname: string;
	data = new SlashCommandBuilder();
	icon: string;
	name: string;
	messages: Map<string, Map<string, string>>;

	constructor(dirname: string) {
		this.dirname = dirname;
	}

	async init() {
		const messagesDir = this.dirname + '/messages';
		const messagesFiles: string[] = [];
		try {
			messagesFiles.push(...fs.readdirSync(messagesDir));
		}
		catch(error) {
			console.warn(error);
		}

		this.messages = new Map();

		for (const name of messagesFiles.filter(m => m.endsWith('.js'))) {
			const messages = await import(`${messagesDir}/${name}`);
			this.messages.set(name, messages.default);
		}
	}

	abstract execute(interaction: CommandInteraction): Promise<void>;
}
