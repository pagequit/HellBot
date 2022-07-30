import { Interaction, InteractionType } from 'discord.js';
import InteractionHandler from '#core/composition/interaction/InteractionHandler';

export default class DiscordInteractionHandler extends InteractionHandler {
	async handle(interaction: Interaction): Promise<void> {
		if (interaction.type !== InteractionType.ApplicationCommand) {
			return;
		}

		const command = this.core.commands.get(interaction.commandName);

		command.unwrapOrElse(() => {
			return this.core.commands.get('default').unwrap();
		})
			.execute(interaction)
			.catch(error => {
				console.error(1648293912239, error);
				interaction.reply({ content: 'An error occurred!', ephemeral: true });
			});
	}
}
