import { expect, test } from "bun:test";
import {
  bufferToolCall,
  parseStreamToCompletionResult,
} from "./parseStreamToCompletionResult";

test("parseStreamToCompletionResult", () => {
  const testStream = new ReadableStream<Uint8Array>({
    start(controller) {
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
        const buffer = Uint8Array.from(chunk.split("").map((c) => parseInt(c)));
        controller.enqueue(buffer);
      }
      controller.close();
    },
  });

  const _ = parseStreamToCompletionResult(testStream);
});

test("testBufferToolCall", () => {
  let result = "";
  let startCount = 0;
  let abortCount = 0;
  const parse = bufferToolCall(
    () => {
      startCount += 1;
    },
    () => {
      abortCount += 1;
    },
    (r: string) => {
      result += r;
    },
  );

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

  expect(result).toBe("hello");
  expect(startCount).toBe(1);
  expect(abortCount).toBe(0);
});

test("testBufferShittyToolCall", () => {
  let result = "";
  let startCount = 0;
  let abortCount = 0;
  const parse = bufferToolCall(
    () => {
      startCount += 1;
    },
    () => {
      abortCount += 1;
    },
    (r: string) => {
      result += r;
    },
  );

  for (const char of "<t>Okey, here we go: {T ool_call>hello<tool_call>world</tool_(c)all></tool_call></t><br>") {
    parse(char);
  }

  expect(result).toBe("world</tool_(c)all>");
  expect(startCount).toBe(4);
  expect(abortCount).toBe(3);
});

test("testBufferMultiToolCall", () => {
  let result = "";
  let startCount = 0;
  let abortCount = 0;
  const parse = bufferToolCall(
    () => {
      startCount += 1;
    },
    () => {
      abortCount += 1;
    },
    (r: string) => {
      result += r;
    },
  );

  for (const char of "<tool_call>hello</tool_call> <t</t>> <tool_call>_world</tool_call><tool_call>_foo</tool_call>") {
    parse(char);
  }

  expect(result).toBe("hello_world_foo");
  expect(startCount).toBe(4);
  expect(abortCount).toBe(1);
});
