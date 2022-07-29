import { CommandInteraction, InteractionResponse } from 'discord.js';
import Command from '#core/composition/entity/Command';
import HellCore from '#core/HellCore';

export default class Ping extends Command {
	constructor(core: HellCore) {
		super(core, __dirname);
		this.icon = ':ping_pong:';
	}

	async execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>> {
		await this.core.redis.SET('hedis:ping', 'pong');
		const ping = await this.core.redis.GET('hedis:ping');
		const reply = this.$t('de', 'reply', `${ping}`);

		return interaction.reply(reply);
	}
}
