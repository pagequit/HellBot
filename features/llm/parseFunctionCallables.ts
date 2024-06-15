import type { FunctionCall } from "./FunctionCall.ts";

export function parseFunctionCallables(
  text: string,
): Array<FunctionCall<object>> {
  const callables = [];
  for (const match of text.matchAll(/<tool_call>\s*(.+)\s*<\/tool_call>/g)) {
    try {
      callables.push(JSON.parse(match[1]));
    } catch (error) {
      console.error(error);
    }
  }

  return callables;
}
