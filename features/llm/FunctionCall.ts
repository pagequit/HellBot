export type FunctionCall<T extends object> = {
  name: string;
  arguments: T;
};

export type Callable<T extends object, U> = (args: T) => U;
