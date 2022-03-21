import { CommandInteraction } from 'discord.js';
import BaseCommand from '#core/abstracts/BaseCommand';

export default class Ping extends BaseCommand {
	constructor() {
		super(__dirname);
	}

	async execute(interaction: CommandInteraction): Promise<void> {

		const foo = await this.$redis.GET('hedis:foo');

		const reply = await this.$t('de', 'DESCRIPTION', `${foo}`);

		return interaction.reply(reply);
	}
}
