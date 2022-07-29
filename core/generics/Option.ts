export type None = null | undefined;
export type Some<T> = T;

export function isNone<T>(value: None|Some<T>): value is None {
	return value === null || value === undefined;
}

export function isSome<T>(value: None|Some<T>): value is Some<T> {
	return !this.isNone(value);
}

export default class Option<T> {
	value: None|Some<T>;

	constructor(value: None|Some<T>) {
		this.value = value;
	}

	isNone(): boolean {
		return isNone(this.value);
	}

	isSome(): boolean {
		return isSome(this.value);
	}

	unwrap(): T {
		if (isNone(this.value)) {
			throw new Error('Cannot unwrap a None');
		}

		return this.value;
	}

	unwrapOr(defaultValue: T): T {
		if (isNone(this.value)) {
			return defaultValue;
		}

		return this.value;
	}

	unwrapOrElse<F extends () => T>(callback: F): T {
		if (isNone(this.value)) {
			return callback();
		}

		return this.value;
	}
}
