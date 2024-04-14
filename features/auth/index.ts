import type { Command } from "@/core/Command.ts";
import { useCrappyStore } from "@/core/CrappyStore.ts";
import type { Feature } from "@/core/Feature.ts";
import type { Core } from "@/core/HellCore.ts";
import { jwt } from "@elysiajs/jwt";
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

const crappyStore = useCrappyStore();

function auth(_core: Core): Command {
  return {
    data: new SlashCommandBuilder().setName("auth").setDescription("WIP"),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
      const token = Math.random().toString(16).substring(2);
      const inviteLink = `http://localhost:8080/auth/${token}`;

      crappyStore.set(token, interaction.user.id);

      interaction.reply({
        content: inviteLink,
        ephemeral: true,
      });
    },
  };
}

export default {
  setup(core: Core): void {
    core.addChatInputGuildCommand(auth(core));
    core.server
      .use(
        jwt({
          name: "jwt",
          secret: process.env.JWT_SECRET as string,
        }),
      )
      .get("/auth/:token", async ({ jwt, set, cookie: { auth }, params }) => {
        const user = crappyStore.get(params.token);

        if (user.isNone()) {
          set.status = 401;
          return "Unauthorized";
        }

        auth.set({
          value: await jwt.sign({ id: user.unwrap() }),
          httpOnly: true,
          maxAge: 7 * 86400,
          path: "/",
          secure: false, // FIXME for production
        });

        crappyStore.delete(params.token);

        return `Sign in as ${user.unwrap()}`;
      })
      .get("/logout", async ({ jwt, set, cookie: { auth } }) => {
        const user = await jwt.verify(auth.value);

        if (!user) {
          set.status = 401;
          return "Unauthorized";
        }

        auth.set({
          value: await jwt.sign({ id: user.id }),
          httpOnly: true,
          maxAge: 0,
          path: "/",
          secure: false, // FIXME for production
        });

        return `Bye ${user.id}`;
      })
      .get("/", async ({ jwt, set, cookie: { auth } }) => {
        const user = await jwt.verify(auth.value);

        if (!user) {
          set.status = 401;
          return "Unauthorized";
        }
        return `Hello ${user.id}`;
      });
  },
} satisfies Feature;
