import InteractionHandler from '#core/composition/interaction/InteractionHandler';
import Message from 'hedis/src/classes/Message';

export default class HedisInteractionHandler extends InteractionHandler {
	async handle(message: Message): Promise<void> {
		return console.log(message.content);
	}
}
