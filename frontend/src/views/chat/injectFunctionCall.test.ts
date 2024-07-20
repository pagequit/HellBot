import { expect, test } from "bun:test";
import type { Message } from "@/features/llm/Message.ts";
import { createPrompt } from "@/features/llm/templates/ChatML/createPrompt.ts";
import { injectFunctionCalls } from "./injectFunctionCalls.ts";

test("injectFunctionCalls", () => {
  const context: Array<Message> = [
    { role: "user", content: "foo" },
    { role: "assistant", content: "bar" },
    { role: "user", content: "hello" }, // function call happens here
    { role: "assistant", content: "world" },
    { role: "user", content: "thx" },
  ];

  const functionCalls: { [key: number]: Array<Message> } = {
    [3]: [
      {
        role: "assistant",
        content: '<tool_call>\n{ "name": "hello" }\n</tool_call>',
      },
      {
        role: "tool",
        content: '<tool_response>\n{ "name": "hello" }\n</tool_response>',
      },
    ],
  };

  const result = injectFunctionCalls(context, functionCalls);

  expect(result).toEqual([
    { role: "user", content: "foo" },
    { role: "assistant", content: "bar" },
    { role: "user", content: "hello" },
    {
      role: "assistant",
      content: '<tool_call>\n{ "name": "hello" }\n</tool_call>',
    },
    {
      role: "tool",
      content: '<tool_response>\n{ "name": "hello" }\n</tool_response>',
    },
    { role: "assistant", content: "world" },
    { role: "user", content: "thx" },
  ]);
});

test("createPrompt first round", () => {
  const context: Array<Message> = [];

  const result = createPrompt("You are a helpful assistant", "hello", context);

  expect(result).toBe(
    "<|im_start|>system\nYou are a helpful assistant<|im_end|>\n<|im_start|>user\nhello<|im_end|>\n<|im_start|>assistant\n",
  );
});

test("createPrompt second round", () => {
  const context: Array<Message> = [
    { role: "user", content: "foo" },
    { role: "assistant", content: "bar" },
  ];

  const result = createPrompt("You are a helpful assistant", "hello", context);

  expect(result).toBe(
    "<|im_start|>system\nYou are a helpful assistant<|im_end|>\n<|im_start|>user\nfoo<|im_end|>\n<|im_start|>assistant\nbar<|im_end|>\n<|im_start|>user\nhello<|im_end|>\n<|im_start|>assistant\n",
  );
});

test("createPromt with injectFunctionCalls", () => {
  const context: Array<Message> = [
    { role: "user", content: "hello" },
    { role: "assistant", content: "world" }, // function call happens here
  ];

  const functionCalls: { [key: number]: Array<Message> } = {
    [1]: [
      {
        role: "assistant",
        content: '<tool_call>\n{ "name": "hello" }\n</tool_call>',
      },
      {
        role: "tool",
        content: '<tool_response>\n{ "name": "hello" }\n</tool_response>',
      },
    ],
  };

  const result = createPrompt(
    "You are a helpful assistant",
    "thx",
    injectFunctionCalls(context, functionCalls),
  );

  expect(result).toBe(
    '<|im_start|>system\nYou are a helpful assistant<|im_end|>\n<|im_start|>user\nhello<|im_end|>\n<|im_start|>assistant\n<tool_call>\n{ "name": "hello" }\n</tool_call><|im_end|>\n<|im_start|>tool\n<tool_response>\n{ "name": "hello" }\n</tool_response><|im_end|>\n<|im_start|>assistant\nworld<|im_end|>\n<|im_start|>user\nthx<|im_end|>\n<|im_start|>assistant\n',
  );
});
