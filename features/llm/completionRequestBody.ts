import { type Static, Type as t } from "@sinclair/typebox";

const samplingParams = t.Object({
  temperature: t.Number({
    minimum: 0.0, // don't know what exactly it means
    maximum: 2.0,
  }),
  top_k: t.Number({
    minimum: 0, // use vocab size
    maximum: 100,
  }),
  top_p: t.Number({
    minimum: 0.1,
    maximum: 1.0, // disabled
  }),
  min_p: t.Number({
    minimum: 0.0, // disabled
    maximum: 1.0,
  }),
  repeat_penalty: t.Number({
    minimum: 1.0, // disabled
    maximum: 2.0,
  }),
  presence_penalty: t.Number({
    minimum: 0.0, // disabled
    maximum: 1.0,
  }),
  frequency_penalty: t.Number({
    minimum: 0.0, // disabled
    maximum: 1.0,
  }),
});

const completionRequestPartial = t.Object({
  prompt: t.String(),
  stop: t.Array(t.String()),
});

export const completionRequestBody = t.Composite([
  completionRequestPartial,
  samplingParams,
]);

export type CompletionRequestBody = Static<typeof completionRequestBody>;
