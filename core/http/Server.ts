import { useCrappyStore } from "@/core/CrappyStore";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import { Elysia } from "elysia";

const crappyStore = useCrappyStore();

export default new Elysia()
	.use(
		jwt({
			name: "jwt",
			secret: "MYSUPERSECRET",
		}),
	)
	.use(cookie())
	.get("/auth/:token", async ({ jwt, set, setCookie, params }) => {
		const user = crappyStore.get(params.token);

		if (user.isNone()) {
			set.status = 401;
			return "Unauthorized";
		}

		setCookie("auth", await jwt.sign({ user: user.unwrap(), ...params }), {
			httpOnly: true,
		});

		crappyStore.delete(params.token);

		return `Sign in as ${user.unwrap()}`;
	})
	.get("/profile", async ({ jwt, set, cookie: { auth } }) => {
		const profile = await jwt.verify(auth);

		if (!profile) {
			set.status = 401;
			return "Unauthorized";
		}
		return `Hello ${profile.user}`;
	});
