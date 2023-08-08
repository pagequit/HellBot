import type HellCore from "/core/HellCore.ts";

export default interface Plugin {
  initialize(core: HellCore): Promise<void>;
}
