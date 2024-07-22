import type { Migration } from "./Migration";

// biome-ignore lint/suspicious/noExplicitAny: there is no way to type this properly
export function migrate<T>(migration: Migration, state: any): T {
  const stateClone = structuredClone(state);

  for (const alter of migration.alter ?? []) {
    for (const [itemKey, alterations] of Object.entries(alter)) {
      for (const [alteration, value] of Object.entries(alterations)) {
        switch (alteration) {
          case "rename": {
            for (const [oldKey, newKey] of Object.entries(
              value as {
                [key: string]: string;
              },
            )) {
              stateClone[newKey] = state[oldKey];
              delete stateClone[oldKey];
            }
            break;
          }
          case "add": {
            for (const [property, val] of Object.entries(
              value as {
                // biome-ignore lint/suspicious/noExplicitAny: there is no way to type this properly
                [key: string]: any;
              },
            )) {
              stateClone[property] = val;
            }
            break;
          }
        }
      }
    }
  }

  return stateClone as T;
}
