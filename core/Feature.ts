import HellCore from "./HellCore.ts";

export type Feature = {
  setup(core: HellCore): Promise<void>;
};
