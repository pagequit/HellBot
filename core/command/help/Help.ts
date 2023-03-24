import { CommandInteraction, InteractionResponse } from "discord.js";
import Command from "#core/command/Command";
import t from "#core/intl/translate";
import OMap from "@pagequit/hedis/dist/unwrap/OMap"; // TODO: use Command type instead

export default class Help extends Command {
    commands: OMap<string, Command>;

    constructor(commands: OMap<string, Command>) {
        super(__dirname);
        this.icon = ":angel:";
        this.commands = commands;
    }

    async execute(
        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>> {
        const reply = t.call(this, "source", "reply", interaction.commandName);

        return interaction.reply(reply);
    }
}
