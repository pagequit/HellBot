import { CommandInteraction, InteractionResponse } from 'discord.js';
import Command from '#core/abstracts/Command';


export default class Auth extends Command {
	constructor() {
		super(__dirname);
	}

	async execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>> {
		const reply = this.$t('source', 'description');

		return interaction.reply(reply);
	}
}
