export type Command = {
  name: string;
  execute: (args: string[]) => void;
};
