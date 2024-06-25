export type CompletoinResult = {
  content: string;
  stop: boolean;
};

export function parseStreamToCompletionResult(
  stream: ReadableStream<Uint8Array>,
): ReadableStream<Uint8Array> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let leftover = "";
  const buffer: Array<Uint8Array> = [];
  let functionCall = "";
  let functionCallParsingStart = false;
  let functionCallParsingAbort = false;
  const parse = bufferToolCall(
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
      // TODO: prevent deadlock if no closing tag is found
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
            parse(data.content);
          } catch (error) {
            console.error(error, `${match[1]}: ${match[2]}`);
          }
        }

        if (functionCallParsingStart) {
          buffer.push(value);

          if (functionCall.length > 0) {
            functionCallParsingStart = false;

            console.log(functionCall);
            functionCall = "";

            for (const chunk of buffer) {
              controller.enqueue(chunk);
            }
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
