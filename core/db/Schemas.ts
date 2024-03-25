// import type { Locale } from "@/core/i18n/I18n.ts";
// import Table from "./Table.ts";

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

// export type GUISettings = {
// 	user_id: string;
// 	locale: Locale;
// 	theme: string;
// };

// const guiSettings = new Table<GUISettings>("gui_settings", {
// 	user_id: "INTEGER PRIMARY KEY",
// 	locale: "TEXT",
// 	theme: "TEXT",
// });
