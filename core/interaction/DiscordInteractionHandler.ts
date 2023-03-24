import { Interaction, InteractionType } from "discord.js";
import loadMessages from "#core/intl/loadMessages";
import { Messages } from "#core/intl/Messages";
import HellCore from "#core/HellCore";

export default class DiscordInteractionHandler {
    core: HellCore;
    messages: Messages;

    constructor(core: HellCore) {
        this.core = core;
        this.messages = new Map();
    }

    async initialize(): Promise<void> {
        await loadMessages(
            __dirname + "./../command/rejection/messages",
            this.messages
        ); // TODO: refactor
    }

    handle(interaction: Interaction): void {
        if (interaction.type !== InteractionType.ApplicationCommand) {
            return;
        }

        const command = this.core.commands
            .oget(interaction.commandName)
            .unwrapOr(this.core.commands.oget("help").unwrap());

        const execution = command.proxiedExecute(interaction, this.core.guild);
        if (execution.isOk()) {
            try {
                command.execute(interaction);
            } catch (error) {
                interaction.reply({
                    content: "An error occurred!",
                    ephemeral: true,
                });
                console.error(error);
            }

            return;
        }

        execution.unwrapErr().handle(interaction);
    }
}
