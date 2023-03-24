import { CommandInteraction } from "discord.js";

export default interface CommandRejection {
    handle(interaction: CommandInteraction): void;
}
