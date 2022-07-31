import { CommandInteraction, Interaction, InteractionType, RoleManager } from 'discord.js';
import InteractionHandler from '#core/composition/interaction/InteractionHandler';

function isAuthorised(interaction: CommandInteraction, roles: RoleManager,accessLevel: number): boolean {
	// TODO
	return true;
}

export type isAuthorised = typeof isAuthorised;

export default class DiscordInteractionHandler extends InteractionHandler {
	async handle(interaction: Interaction): Promise<void> {
		if (interaction.type !== InteractionType.ApplicationCommand) {
			return;
		}

		const command = this.core.commands.get(interaction.commandName);

		command.unwrapOr(this.core.commands.get('default').unwrap())
			.proxiedExecute(interaction, isAuthorised)
			.catch(error => {
				console.error(1648293912239, error);
				interaction.reply({ content: 'An error occurred!', ephemeral: true });
			});
	}
}
