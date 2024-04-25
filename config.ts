export const discord = {
  token: process.env.DISCORD_APP_ID as string,
  guildId: process.env.HELLNET_ID as string,
  applicationId: process.env.HELLBOT_ID as string,
};
export const botlog = {
  token: process.env.BOTLOG_TOKEN as string,
  id: process.env.BOTLOG_ID as string,
};
export const server = {
  port: (process.env.SERVER_PORT as string) ?? "3000",
  hostname: (process.env.SERVER_HOSTNAME as string) ?? "localhost",
  origin: (process.env.VITE_SERVER_ORIGIN as string) ?? "http://localhost:3000",
};
export const frontend = {
  origin: (process.env.VITE_SERVER_ORIGIN as string) ?? "http://localhost:3080",
};
