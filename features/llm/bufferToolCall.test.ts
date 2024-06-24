import { expect, test } from "bun:test";
import { bufferToolCall } from "./parseStreamToCompletionResult";

test("testBufferToolCall", () => {
  const buffer = { ref: "" };
  const parse = bufferToolCall(buffer);

  for (const chunk of [
    "<",
    "tool",
    "_",
    "call",
    ">",
    "hello",
    "<",
    "/",
    "tool",
    "_",
    "call",
    ">",
  ]) {
    parse(chunk);
  }

  expect(buffer.ref).toBe("hello");
});

test("testBufferShittyToolCall", () => {
  const buffer = { ref: "" };
  const parse = bufferToolCall(buffer);

  for (const char of "<t>Okey, here we go: {T ool_call>hello<tool_call>world</tool_(c)all></tool_call></t><br>") {
    parse(char);
  }

  expect(buffer.ref).toBe("world</tool_(c)all>");
});

test("testBufferMultiToolCall", () => {
  const buffer = { ref: "" };
  const parse = bufferToolCall(buffer);

  for (const char of "<tool_call>hello</tool_call> <t</t>> <tool_call>_world</tool_call>") {
    parse(char);
  }

  expect(buffer.ref).toBe("hello_world");
});
