import HellCore from "#core/HellCore";

export interface HellPlugin {
    initialize(core: HellCore): Promise<void>;
}
