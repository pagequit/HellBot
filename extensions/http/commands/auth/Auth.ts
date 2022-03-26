import { CommandInteraction } from 'discord.js';
import Command from '#core/abstracts/Command';

export default class Ping extends Command {
	async execute(interaction: CommandInteraction): Promise<void> {
		return interaction.reply('Auth');
	}
}
