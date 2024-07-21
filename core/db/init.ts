import { users } from "./User/users";

const bob = users.insert({
  id: "42",
  avatar_URL: "https://cdn.discordapp.com/avatars/1234.webp",
  display_name: "Bob",
});

console.log(bob);
users.updateBy("display_name", { id: "42", display_name: "Bob" });
console.log(users.findBy("id", "42"));

// WIP
