import { CommandInteraction, InteractionResponse } from 'discord.js';
import HellCore from '#core/HellCore';
import { loadMessages, translate } from '#core/generics/methods';
import { Messages } from '#core/generics/types';


export default abstract class Command {
	accessLevel: number|null = null;
	dirname: string;
	icon: string;
	messages: Messages;
	core: HellCore;
	$t: typeof translate;

	get description(): string {
		return this.messages.get('source')?.get('description') ?? '';
	}

	constructor(dirname: string) {
		this.dirname = dirname;
	}

	async initialize(hellcore: HellCore): Promise<void> {
		this.core = hellcore;

		const messagesDir = this.dirname + '/messages';
		this.messages = await loadMessages(messagesDir);
	}

	abstract execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>>;
}

Command.prototype.$t = translate;
