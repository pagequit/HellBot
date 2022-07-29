import HellCore from '#core/HellCore';

export default interface Extension {
	initialize(hellCore: HellCore): Promise<void>;
}
