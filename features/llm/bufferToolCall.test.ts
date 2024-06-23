import { expect, test } from "bun:test";

function bufferToolCall(buffer: { ref: string }): (chunk: string) => void {
  const tags = ["<tool_call>", "</tool_call>"];
  let turn = 0;
  let index = 0;

  return (chunk: string) => {
    for (const char of chunk) {
      if (tags[turn][index] === char) {
        index += 1;
      } else if (turn === 1) {
        buffer.ref += char;
      }

      if (index === tags[turn].length) {
        turn += 1;
        index = 0;

        if (turn === 2) {
          turn = 0;
          return;
        }
      }
    }
  };
}

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
