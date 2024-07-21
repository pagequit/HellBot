import Table from "../Table.ts";

export type User = {
  id: string;
  avatar_URL: string;
  display_name: string;
};

export const users = new Table<User>("users", {
  id: "TEXT PRIMARY KEY",
  avatar_URL: "TEXT",
  display_name: "TEXT",
});
