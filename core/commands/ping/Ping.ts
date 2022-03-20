import { CommandInteraction } from 'discord.js';
import BaseCommand from '#core/abstracts/BaseCommand';

export default class Ping extends BaseCommand {
	constructor() {
		super(__dirname);
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		const reply = await this.$t('de', 'DESCRIPTION', 'Pong');

		return interaction.reply(reply);
	}

	async $t(locale: string, key: string, ...args: string[]): Promise<string> {
		let rawMessage = this.messages.get('source.js')?.get(key) ?? key;
		rawMessage = this.messages.get(`${locale}.js`)?.get(key) ?? rawMessage;

		let message = rawMessage;
		for (const [idx, arg] of args.entries()) {
			message = message.replace(`{${idx}}`, arg);
		}

		return message;
	}
}
