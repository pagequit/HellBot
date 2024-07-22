import { expect, test } from "bun:test";
import type { Migration } from "./Migration";
import { migrate } from "./migrate.ts";

test("migrate rename", () => {
  const item = {
    foo: "foo",
  };

  const m1 = {
    alter: [
      {
        item: {
          rename: {
            foo: "oof",
          },
        },
      },
    ],
  } satisfies Migration;

  const result = migrate(m1, item);

  expect(result).toMatchObject({
    oof: "foo",
  });
});

test("migrate add", () => {
  const item = {
    bar: {
      one: 1,
    },
  };

  const m1 = {
    alter: [
      {
        item: {
          add: {
            foo: "foo",
          },
        },
      },
    ],
  } satisfies Migration;

  const result = migrate(m1, item);

  expect(result).toMatchObject({
    foo: "foo",
    bar: {
      one: 1,
    },
  });
});
