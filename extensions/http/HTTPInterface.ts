import Extension from '#core/composition/entity/Extension';
import HellCore from '#core/HellCore';
import Auth from './commands/auth/Auth';
import HTTPInteractionHandler from './HTTPInteractionHandler';

export default class HTTPInterface implements Extension {
	httpInteractionHandler: HTTPInteractionHandler;

	constructor(core: HellCore) {
		this.httpInteractionHandler = new HTTPInteractionHandler(core);
	}

	async initialize(core: HellCore): Promise<void> {
		await core.registerCommand('auth', new Auth(core));
	}
}
