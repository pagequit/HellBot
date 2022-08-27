export function isPrivate(accessLevel: number): boolean {
	return (accessLevel & 0b1) === 0b1;
}

export function needsRegistration(accessLevel: number): boolean {
	return ((accessLevel >>> 1 ) & 0b1) === 0b0;
}

export function hasAccess(accessLevel: number, requestLevel: number): boolean {
	return requestLevel <= (accessLevel >>> 2);
}

export function toString(accessLevel: number): string {
	return (accessLevel >>> 0).toString(2);
}
