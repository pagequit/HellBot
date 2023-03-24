import { HellPlugin } from "#core/HellPlugin";
import HellCore from "#core/HellCore";
import Ping from "./Ping";

export default class implements HellPlugin {
    async initialize(core: HellCore): Promise<void> {
        await core.registerCommand("ping", new Ping());
    }
}
