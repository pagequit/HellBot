import { CommandInteraction, InteractionResponse } from 'discord.js';
import Command from '#core/composition/entity/Command';
import HellCore from '#core/HellCore';

export default class Default extends Command {
	constructor(core: HellCore) {
		super(core, __dirname);
		this.icon = ':interrobang:';
	}

	async execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>> {
		const reply = this.$t('source', 'reply', `${interaction.commandName}`);

		return interaction.reply(reply);
	}
}
