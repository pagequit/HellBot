import Extension from '#core/composition/entity/Extension';
import HellCore from '#core/HellCore';
import Auth from './commands/auth/Auth';

export default class HTTPInterface implements Extension {
	async initialize(hellCore: HellCore): Promise<void> {
		throw new Error('Method not implemented.');
		await hellCore.registerCommand('auth', new Auth(hellCore));
		await hellCore.deployCommands();
	}
}
