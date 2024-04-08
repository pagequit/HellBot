import { readdir } from "node:fs/promises";
import type { Core } from "./HellCore.ts";

export type Feature = {
  setup(core: Core): void;
};

export async function loadFeatures(
  path = `${process.cwd()}/features`,
): Promise<Feature[]> {
  const features: Feature[] = [];
  for (const name of await readdir(path)) {
    features.push((await import(`${path}/${name}/index.ts`)).default);
  }

  return features;
}
