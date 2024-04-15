import { Collection } from "unwrap/mod.ts";

const store = new Collection<string, string>();

export function useStore(): Collection<string, string> {
  return store;
}
