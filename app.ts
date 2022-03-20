#!/usr/bin/node

import 'dotenv/config';
import HellBot from '#core/HellBot';
import { config } from './hell.config';

(async function() {
	const hellBot = new HellBot(config);
	await hellBot.init();
})();
