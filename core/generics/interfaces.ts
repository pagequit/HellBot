import HellCore from '#core/HellCore';


export interface Extension {
	initialize(hellCore: HellCore): Promise<void>;
}
