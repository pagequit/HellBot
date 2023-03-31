import { CommandInteraction, InteractionResponse } from "discord.js";
import Command from "#core/command/Command";
import t from "#core/intl/translate";
import messages from "./messages/source";

export default class Ping extends Command {
    constructor() {
        super(__dirname);
        this.accessLevel = 2;
        this.isPublic = true;
        this.icon = ":ping_pong:";
        this.slashCommandBuilder
            .setName("ping")
            .setDescription(messages.description);
    }

    async execute(
        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const reply = t.call(this, interaction.locale.slice(0, 2), "reply");

        return interaction.reply(reply);
    }
}
