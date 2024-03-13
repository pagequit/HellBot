import { Elysia } from "elysia";

export default new Elysia().get("/ping", async () => {
	return "pong";
});
