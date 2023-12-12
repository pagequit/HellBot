import HellCore from "./HellCore.ts";

export type Feature = {
  setup(core: HellCore): void;
};

export async function loadFeatures(
  path = `${Deno.cwd()}/features`,
): Promise<Feature[]> {
  const features: Feature[] = [];
  for await (const dir of Deno.readDir(path)) {
    features.push(
      (await import(`${path}/${dir.name}/index.ts`)).default,
    );
  }

  return features;
}
