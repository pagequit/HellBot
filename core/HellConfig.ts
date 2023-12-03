export type HellConfig = {
  botlog: {
    id: string;
    token: string;
  };
  discord: {
    token: string;
    guildId: string;
    clientId: string;
  };
  path: {
    features: string;
  };
};
