import { CommandInteraction } from 'discord.js';
import BaseCommand from '../../abstracts/BaseCommand';

export default class Help extends BaseCommand {
	async execute(interaction: CommandInteraction): Promise<void> {
		return Promise.resolve();
	}
}
