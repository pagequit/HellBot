import { CommandInteraction } from 'discord.js';
import BaseCommand from '#core/abstracts/BaseCommand';

export default class Help extends BaseCommand {
	constructor() {
		super(__dirname);
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		return Promise.resolve();
	}
}
