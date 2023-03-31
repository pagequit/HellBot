import { CommandInteraction, InteractionResponse } from "discord.js";
import Command from "#core/command/Command";
import t from "#core/intl/translate";
import OMap from "@pagequit/hedis/dist/unwrap/OMap";
import messages from "./messages/source";
import messagesDe from "./messages/de";

export default class Help extends Command {
    commands: OMap<string, Command>;

    constructor(commands: OMap<string, Command>) {
        super(__dirname);
        this.icon = ":angel:";
        this.commands = commands;
        this.slashCommandBuilder
            .setName("help")
            .setDescription(messages.description)
            .setDescriptionLocalizations({
                "de": messagesDe.description,
                "en-GB": messages.description,
                "en-US": messages.description,
            });
    }

    async execute(
        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const reply = t.call(this, interaction.locale.slice(0, 2), "reply");

        return interaction.reply(reply);
    }
}
