import { Collection } from "unwrap/mod.ts";

const crappyStore = new Collection<string, string>();

export function useCrappyStore(): Collection<string, string> {
  return crappyStore;
}
