export type CompletoinResult = {
  content: string;
  stop: boolean;
};

export function parseStreamToCompletionResult(
  stream: ReadableStream<Uint8Array>,
): ReadableStream<CompletoinResult> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let leftover = "";

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
            controller.enqueue(data);
            console.log(data);
          } catch (error) {
            console.error(error, `${match[1]}: ${match[2]}`);
          }
        }
      }
    },
  });
}
