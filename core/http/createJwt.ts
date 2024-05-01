import { jwt } from "@elysiajs/jwt";

export function createJwt() {
  return jwt({
    name: "jwt",
    secret: process.env.JWT_SECRET as string,
  });
}
