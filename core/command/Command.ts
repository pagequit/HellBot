import {
    CommandInteraction,
    Guild,
    InteractionResponse,
    PermissionsBitField,
} from "discord.js";
import loadMessages from "#core/intl/loadMessages";
import { Messages } from "#core/intl/Messages";
import PermissionsRejection from "#core/command/rejection/PermissionsRejection";
import Result, { Err, Ok } from "@pagequit/hedis/dist/unwrap/result";
import CommandRejection from "./rejection/CommandRejection";

export default abstract class Command {
    accessLevel: number;
    dirname: string;
    icon: string;
    isPublic: boolean;
    messages: Messages;

    get description(): string {
        return this.messages.get("source")?.get("description") ?? "n/a";
    }

    constructor(dirname: string) {
        this.dirname = dirname;
        this.accessLevel = Number.POSITIVE_INFINITY;
        this.isPublic = false;
        this.icon = ":question:";
        this.messages = new Map();
    }

    hasAccess(requestLevel: number): boolean {
        return this.accessLevel >= requestLevel;
    }

    async initialize(): Promise<void> {
        const messagesDir = this.dirname + "/messages";
        await loadMessages(messagesDir, this.messages);
    }

    proxiedExecute(
        interaction: CommandInteraction,
        guild: Guild
    ): Result<CommandInteraction, CommandRejection> {
        const member = guild.members.cache.get(interaction.user.id);
        if (
            member &&
            (member.permissions.has(PermissionsBitField.Flags.Administrator) ||
                this.hasAccess(
                    Math.abs(
                        member.roles.highest.position -
                            guild.roles.highest.position
                    )
                ))
        ) {
            return Ok(interaction);
        }

        return Err(new PermissionsRejection());
    }

    abstract execute(
        interaction: CommandInteraction
    ): Promise<InteractionResponse<boolean>>;
}
