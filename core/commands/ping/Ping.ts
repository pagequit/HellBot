import { CommandInteraction, InteractionResponse } from 'discord.js';
import Command from '#core/abstracts/Command';


export default class Ping extends Command {
	constructor() {
		super(__dirname);
		this.icon = ':ping_pong:';
	}

	async execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>> {
		await this.core.redis.SET('hedis:ping', 'pong');
		const ping = await this.core.redis.GET('hedis:ping');
		const reply = this.$t('de', 'reply', `${ping}`);

		return interaction.reply(reply);
	}
}
