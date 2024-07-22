export type Migration = {
  alter?: Array<{
    [key: string]: {
      rename?: {
        [key: string]: string;
      };
      add?: {
        // biome-ignore lint/suspicious/noExplicitAny: there is no way to type this properly
        [key: string]: any;
      };
    };
  }>;
};
