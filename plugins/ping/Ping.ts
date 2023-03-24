import { CommandInteraction, InteractionResponse } from "discord.js";
import Command from "#core/command/Command";
import t from "#core/intl/translate";

export default class Ping extends Command {
    constructor() {
        super(__dirname);
        this.accessLevel = 1;
        this.isPublic = true;
        this.icon = ":ping_pong:";
    }

    async execute(
        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const reply = t.call(this, "source", "reply");

        return interaction.reply(reply);
    }
}
