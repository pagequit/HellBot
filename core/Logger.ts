export type Logger = {
  log(message: string, ...payload: unknown[]): void;
  warn(message: string, ...payload: unknown[]): void;
  error(message: string, ...payload: unknown[]): void;
};
