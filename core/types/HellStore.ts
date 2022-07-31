import Option from '#core/generics/Option';

export type HellStore = {
	get(key: string): Promise<Option<unknown>>;
};
