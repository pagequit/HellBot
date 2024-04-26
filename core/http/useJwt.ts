import { jwt } from "@elysiajs/jwt";

const instance = jwt({
  name: "jwt",
  secret: process.env.JWT_SECRET as string,
});

export function useJwt() {
  return instance;
}
