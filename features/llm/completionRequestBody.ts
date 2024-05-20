import { t } from "elysia";

const samplingParams = t.Object({
  temperature: t.Number({
    minimum: 0.1,
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
  stream: t.Boolean(),
  stop: t.String(),
  n_predict: t.Number({
    minimum: 1, // -1 = infinite, but I don't want to allow that
    maximum: 1024,
  }),
});

export const completionRequestBody = t.Composite([
  completionRequestPartial,
  samplingParams,
]);
