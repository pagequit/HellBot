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

	constructor(core: HellCore, dirname: string) {
		this.core = core;
		this.dirname = dirname;
	}

	async initialize(): Promise<void> {
		const messagesDir = this.dirname + '/messages';
		this.messages = await loadMessages(messagesDir);
	}

	abstract execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>>;
}

Command.prototype.$t = translate;
