import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export default abstract class BaseCommand {
	data = new SlashCommandBuilder();
	icon: string;
	name: string;

	abstract execute(interaction: CommandInteraction): Promise<void>;
}
