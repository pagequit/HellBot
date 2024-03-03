import { type Message } from "../Message.ts";

function prompt(context: Array<Message>, content: string): string {
  return context.reduce((acc, cur, idx) => {
    return idx % 2 === 0
      ? `${acc}[INST] ${cur.content} [/INST]`
      : `${acc} ${cur.content}</s>`;
  }, "<s>") + `[INST] ${content} [/INST]`;
}

export default function () {
  const context: Array<Message> = [
    {
      role: "user",
      content: "Hello, world!",
    },
    {
      role: "assistant",
      content: "Hello from the other side!",
    },
    {
      role: "user",
      content: "Whasup, there?",
    },
    {
      role: "assistant",
      content: "Well, how are you?",
    },
  ];

  const content = "Foo bar?";

  console.log(prompt(context, content));

  console.log(
    "<s>[INST] Hello, world! [/INST] Hello from the other side!</s>[INST] Whasup, there? [/INST] Well, how are you?</s>[INST] Foo bar? [/INST]" ===
      prompt(context, content),
  );

  console.log(prompt([], content));

  console.log(
    "<s>[INST] Foo bar? [/INST]" === prompt([], content),
  );
}
