import { CommandInteraction } from 'discord.js';
import BaseCommand from '../../abstracts/BaseCommand';

export default class Ping extends BaseCommand {
	async execute(interaction: CommandInteraction): Promise<void> {
		return interaction.reply('pong');
	}
}
