import { logger } from "@/core/discord/logger.ts";
import type { Collection } from "unwrap/mod";
import { completionRequest } from "./completionRequest.ts";
import type { CompletionRequestBody } from "./completionRequestBody.ts";

const decoder = new TextDecoder();
const encoder = new TextEncoder();

function surroundWithToolResponseTemplate(response: string): string {
  return `<|im_start|>tool\n<tool_response>\n${response}\n</tool_response>\n<|im_end|>\n`;
}

async function makeFunctionCallRoundtrip(
  requestBody: CompletionRequestBody,
): Promise<ReadableStream<Uint8Array>> {
  const response = await completionRequest(requestBody);
  return response.body as ReadableStream<Uint8Array>;
}

async function processFunctionCall(
  functionCall: string,
  controller: ReadableStreamDefaultController,
  functions: Collection<string, (args: any) => string>,
  requestBody: CompletionRequestBody,
  responseContent: string,
): Promise<ReadableStream<Uint8Array>> {
  let res = "";
  try {
    const fc = JSON.parse(functionCall);
    functions.get(fc.name).map((fn) => {
      res = fn(fc.arguments);
    });
  } catch (error) {
    logger.error(
      `${(error as Error).message}. Error at: "${functionCall}"`,
      error,
    );
  }

  let data = `<|im_start|>assistant\n${responseContent}<|im_end|>\n`;
  data = JSON.stringify({
    content: `${data}${surroundWithToolResponseTemplate(res)}`,
  });
  controller.enqueue(encoder.encode(`event: functionCall\ndata: ${data}\n`));

  return await makeFunctionCallRoundtrip(requestBody);
}

export function parseStreamToCompletionResult(
  stream: ReadableStream<Uint8Array>,
  requestBody: CompletionRequestBody,
  functions: Collection<string, (args: any) => string>,
): ReadableStream<Uint8Array> {
  const reader = stream.getReader();
  let leftover = "";
  const buffer: Array<Uint8Array> = [];
  let responseContent = "";
  let functionCall = "";
  let functionCallParsingStart = false;
  let functionCallParsingAbort = false;
  const parseToolCall = bufferToolCall(
    () => {
      functionCallParsingStart = true;
    },
    () => {
      functionCallParsingAbort = true;
    },
    (result: string) => {
      functionCall = result;
    },
  );

  return new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          reader.releaseLock();
          return;
        }

        const text = leftover + decoder.decode(value);
        const lines = text.split("\n");
        leftover = text.endsWith("\n") ? "" : (lines.pop() as string);

        for (const line of lines) {
          const match = line.match(/(\w+):(.*)/);
          if (!match) {
            continue;
          }

          try {
            const data = JSON.parse(match[2].trim());
            responseContent += data.content;
            parseToolCall(data.content);
          } catch (error) {
            logger.error(
              `${(error as Error).message}. Error at: "${match[1]}: ${match[2]}".`,
              error,
            );
          }
        }

        if (functionCallParsingStart) {
          buffer.push(value);

          // It's either empty or completed, nothing in between.
          if (functionCall.length > 0) {
            const processedResponse = await processFunctionCall(
              functionCall,
              controller,
              functions,
              requestBody,
              responseContent,
            );

            const prr = processedResponse.getReader();
            while (true) {
              const { done, value } = await prr.read();
              if (done) {
                prr.releaseLock();
                break;
              }

              controller.enqueue(value);
            }

            functionCall = "";
            functionCallParsingStart = false;
          }

          if (functionCallParsingAbort) {
            functionCallParsingAbort = false;
            functionCallParsingStart = false;

            for (const chunk of buffer) {
              controller.enqueue(chunk);
            }
          }
        } else {
          controller.enqueue(value);
        }
      }
    },
  });
}

export function bufferToolCall(
  onStart: () => void,
  onAbort: () => void,
  onComplete: (result: string) => void,
): (chunk: string) => void {
  const tags = ["<tool_call>", "</tool_call>"];
  let buffer = "";
  let turn = 0;
  let index = 0;
  let indexGuard = 0;
  let toggle = true;

  return (chunk: string) => {
    for (const char of chunk) {
      if (tags[turn][index] === char && indexGuard === index) {
        if (turn === 0 && toggle) {
          onStart();
          toggle = false;
        }
        index += 1;
      }
      indexGuard += 1;

      if (turn === 1) {
        buffer += char;
      }

      if (index === tags[turn].length) {
        turn += 1;
      }

      if (turn === 2) {
        onComplete(buffer.slice(0, -tags[1].length));
        buffer = "";
        turn = 0;
        index = 0;
        indexGuard = 0;
        toggle = true;
      }

      if (index !== indexGuard) {
        if (turn === 0 && !toggle) {
          onAbort();
          toggle = true;
        }
        index = 0;
        indexGuard = 0;
      }
    }
  };
}
