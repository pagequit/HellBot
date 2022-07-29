import Option from '#core/generics/Option';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class OptionMap<_, V> extends Map {
	get(key: string): Option<V> {
		return new Option(super.get(key));
	}
}
