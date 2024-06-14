export type FunctionCallable<T extends { [key: string]: unknown }, U> = (
  args: T,
) => U;
