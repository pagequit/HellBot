import { expect, test } from "bun:test";
type ToolCallTemplate = {
  index: number;
  template: string;
};

const toolCallStart = {
  index: 0,
  template: "<tool_call>",
} satisfies ToolCallTemplate;

const toolCallEnd = {
  index: 0,
  template: "</tool_call>",
} satisfies ToolCallTemplate;

const toolCallTurns = [toolCallStart, toolCallEnd];
let toolCallTurn = 0;

function bufferToolCall(buffer: { ref: string }): (chunk: string) => void {
  return (chunk: string) => {
    for (const char of chunk) {
      const toolCall = toolCallTurns[toolCallTurn];

      if (toolCall.template[toolCall.index] === char) {
        toolCallTurns[toolCallTurn].index += 1;
      } else if (toolCallTurn === 1) {
        buffer.ref += char;
        console.log(buffer.ref);
      }

      if (toolCall.index === toolCall.template.length) {
        toolCallTurn += 1;
        toolCall.index = 0;
        if (toolCallTurn === 2) {
          toolCallTurn = 0;
          return;
        }
      }
    }
  };
}

test("testBufferToolCall happy string", () => {
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

test("testBufferToolCall stupid string", () => {
  const buffer = { ref: "" };
  const parse = bufferToolCall(buffer);

  for (const char of '<tool_call> {"arguments": {"symbol": "TSLA"}, "name": "get_stock_fundamentals"} </tool_call>') {
    parse(char);
  }

  expect(buffer.ref).toBe(
    ' {"arguments": {"symbol": "TSLA"}, "name": "get_stock_fundamentals"} ',
  );
});
