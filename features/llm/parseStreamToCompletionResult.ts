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
  const buffer: CompletoinResult[] = [];
  const functionCallParsing = false;

  return new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (functionCallParsing) {
        }

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
            buffer.push(data);
          } catch (error) {
            console.error(error, `${match[1]}: ${match[2]}`);
          }
        }

        controller.enqueue(value);
      }
    },
  });
}

export function bufferToolCall(buffer: {
  ref: string;
}): (chunk: string) => void {
  const tags = ["<tool_call>", "</tool_call>"];
  let turn = 0;
  let index = 0;
  let indexGuard = 0;

  return (chunk: string) => {
    for (const char of chunk) {
      if (tags[turn][index] === char && indexGuard === index) {
        index += 1;
      }
      indexGuard += 1;

      if (turn === 1) {
        buffer.ref += char;
      }

      if (index === tags[turn].length) {
        turn += 1;
      }

      if (turn === 2) {
        turn = 0;
        buffer.ref = buffer.ref.slice(0, -tags[1].length);
      }

      if (index !== indexGuard) {
        index = 0;
        indexGuard = 0;
      }
    }
  };
}
