import { Extension } from '#core/generics/interfaces';
import HellCore from '#core/HellCore';
import Auth from './commands/auth/Auth';


export default class HTTPInterface implements Extension {
	async initialize(hellCore: HellCore): Promise<void> {
		throw new Error('Method not implemented.');
		await hellCore.registerCommand('auth', new Auth());
		await hellCore.deployCommands();
	}
}
