import {
	CommandInteraction,
	Interaction,
	InteractionType,
	Guild,
	GuildMember,
	PermissionsBitField,
} from 'discord.js';
import InteractionHandler from '#core/composition/interaction/InteractionHandler';
import Option from '#core/generics/Option';
import { needsRegistration } from '#core/composition/command/accessLevelHelpers';

function isAuthorised(interaction: CommandInteraction, accessLevel: number, guild: Guild): boolean {
	const member = new Option<GuildMember>(
		guild.members.cache.get(interaction.user.id)
	);

	if (
		accessLevel === -1 || member.isSome()
		&& member.unwrap().permissions.bitfield ===  PermissionsBitField.Flags.Administrator
	) {
		return true;
	}

	if (needsRegistration(accessLevel)) {
		// TODO
	}

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
