import { CommandInteraction, InteractionResponse } from 'discord.js';
import HellCore from '#core/HellCore';
import loadMessages from '#core/composition/i18n/loadMessages';
import translate from '#core/composition/i18n/translate';
import { Messages } from '#core/composition/i18n/Messages';
import { isAuthorised } from '../interaction/DiscordInteractionHandler';

export default abstract class Command {
	accessLevel: number;
	core: HellCore;
	dirname: string;
	icon: string;
	messages: Messages;
	$t: typeof translate;

	get description(): string {
		return this.messages.get('source')?.get('description') ?? '';
	}

	constructor(core: HellCore, dirname: string) {
		this.accessLevel = Number.POSITIVE_INFINITY;
		this.core = core;
		this.dirname = dirname;
	}

	async initialize(): Promise<void> {
		const messagesDir = this.dirname + '/messages';
		this.messages = await loadMessages(messagesDir);
	}

	async proxiedExecute(interaction: CommandInteraction, isAuthorised: isAuthorised): Promise<InteractionResponse<boolean>> {
		if (isAuthorised(interaction, this.core.guild.unwrap().roles, this.accessLevel)) {
			return this.execute(interaction);
		} else {
			return interaction.reply(this.$t('source', 'command_rejection_permission'));
		}
	}

	abstract execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>>;
}

Command.prototype.$t = translate;
