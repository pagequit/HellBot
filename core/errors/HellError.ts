export default class HellError extends Error {
	key: string;

	constructor(code: number, message: (args: unknown[]) => string, ...args: unknown[]) {
		args.unshift(code);

		super(message(args));

		this.key = message.name;

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, HellError);
		}
	}
}
