import HellCore from '#core/HellCore';


export interface Extension {
	initialize(hellcore: HellCore): Promise<void>;
}
