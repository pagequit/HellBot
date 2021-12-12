import { CommandInteraction } from 'discord.js';
import { Command } from '../../interfaces';

export default class Ping implements Command {
	async execute(interaction: CommandInteraction): Promise<void> {
		return interaction.reply('pong');
	}
}
