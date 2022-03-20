export const UNKNOWN_COMMAND = (args: unknown[]): string => `${args[0]}, unknown command: "${args[1]}".`;
export const INSUFFICIENT_ARGUMENTS = (args: unknown[]): string => `${args[0]}, insufficient arguments.`;
