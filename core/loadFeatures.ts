import { readdir } from "node:fs/promises";
import type { Feature } from "@/core/Feature.ts";

export async function loadFeatures(path: string): Promise<Feature[]> {
  const features: Feature[] = [];
  for (const name of await readdir(path)) {
    features.push((await import(`${path}/${name}/index.ts`)).default);
  }

  return features;
}
