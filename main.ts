import { botlog, discord } from "@/config.ts";
import HellCore from "@/core/HellCore.ts";
import HellLog from "@/core/HellLog.ts";
import server from "@/core/http/Server";

new HellCore(new HellLog(botlog)).setup().then((hellBot) => {
	hellBot.login(discord.token);
});

server.listen(8080);

// import Table from "@/core/db/Table";

// type User = {
// 	id: number;
// 	name: string;
// 	email: string;
// };

// const users = new Table<User>("users", {
// 	id: "INTEGER PRIMARY KEY",
// 	name: "TEXT",
// 	email: "TEXT",
// });

// const bob = users.insert({
// 	id: 1,
// 	name: "Bob",
// 	email: "bob@example.com",
// });

// console.log(bob);
// users.updateBy("name", { id: 42, name: "Bob" });
// console.log(users.findBy("id", "42"));
