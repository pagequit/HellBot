import { expect, test } from "bun:test";
import type { Message } from "@/features/llm/Message.ts";
import { injectFunctionCalls } from "./injectFunctionCalls.ts";
import { createPrompt } from "./llama.cpp/hermes2/createPrompt.ts";

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

/*
<|im_start|>user\n
please remind me on my pizza in five minutes.<|im_end|>\n

<|im_start|>assistant\n
<tool_call>\n
{\"arguments\": {\"minutes\": 5, \"subject\": \"pizza\"}, \"name\": \"set_timer\"}\n
</tool_call><|im_end|>\n

<|im_start|>tool\n
<tool_reponse>\n
{\"name\":\"set_timer\",\"content\":{\"minutes\":5,\"subject\":\"pizza\"}}\n
</tool_response>\n
<|im_end|>\n

<|im_start|>assistant\n
<tool_call>\n
{\"arguments\": {\"minutes\": 5, \"subject\": \"pizza\"}, \"name\": \"set_timer\"}\n
</tool_call><|im_end|>\n

<|im_start|>user\n
excuse me?<|im_end|>\n

<|im_start|>assistant\n
I've set a timer for 5 minutes to remind you about your pizza. You'll be notified when the time is up.<|im_end|>\n

<|im_start|>user\n
thanks :D<|im_end|>\n

<|im_start|>assistant\n
You're welcome! Enjoy your pizza.<|im_end|>\n

<|im_start|>user\n
Oh, damn. I forgot to turn on the oven, could you please set the again?<|im_end|>\n

<|im_start|>assistant\n
Of course! I'll reset the timer for another 5 minutes. You should have plenty of time to get your pizza in the oven before it's ready.<|im_end|>\n

<|im_start|>user\n
You doesn't set the timer, don't you?<|im_end|>\n

<|im_start|>assistant\n
I apologize for the confusion earlier. Here is the correct response:\n
\n
<tool_call>\n
{\"arguments\": {\"minutes\": 5, \"subject\": \"pizza\"}, \"name\": \"set_timer\"}\n
</tool_call><|im_end|>\n

<|im_start|>tool\n
<tool_reponse>\n
{\"name\":\"set_timer\",\"content\":{\"minutes\":5,\"subject\":\"pizza\"}}\n
</tool_response>\n
<|im_end|>\n

<|im_start|>assistant\n
Apologies for the mistake. Let me set the timer again. I'll reset it for 5 minutes to remind you about your pizza.<|im_end|>\n

<|im_start|>user\n
You need to respond with this JSON stuff inside these tool_call tags, you remember?<|im_end|>\n

<|im_start|>assistant\n
I apologize for the confusion earlier. Here is the correct response:\n
\n
I apologize for the confusion. Here's the correct response:\n
\n
<tool_call>\n
{\"arguments\": {\"minutes\": 5, \"subject\": \"pizza\"}, \"name\": \"set_timer\"}\n
</tool_call><|im_end|>\n

<|im_start|>user\n
thank you<|im_end|>\n

<|im_start|>assistant\n
*/
