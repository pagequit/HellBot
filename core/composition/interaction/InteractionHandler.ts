import HellCore from '#core/HellCore';

export default abstract class InteractionHandler {
	core: HellCore;

	constructor(core: HellCore) {
		this.core = core;
	}

	abstract handle(...payload: unknown[]): Promise<void>;
}
