import HellCore from '#core/HellCore';

export default interface Extension {
	initialize(core: HellCore): Promise<void>;
}
