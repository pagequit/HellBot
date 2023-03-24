import { CommandInteraction } from "discord.js";
import CommandRejection from "#core/command/rejection/CommandRejection";

export default class PermissionsRejection implements CommandRejection {
    handle(interaction: CommandInteraction): void {
        interaction.reply({ content: "PermissionsRejection", ephemeral: true });
    }
}
