import InteractionHandler from '#core/composition/interaction/InteractionHandler';

export default class HTTPInteractionHandler extends InteractionHandler {
	async handle(): Promise<void> {
		return console.log('HTTP interaction handler called.');
	}
}
