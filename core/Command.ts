export type Command = {
  tag: "command";
  name: string;
  execute: (args: string[]) => void;
};

export default "command";
