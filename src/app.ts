#!/usr/bin/node
import 'dotenv/config';
import { config } from '../hell.config';
import HellBot from './HellBot';

(async function() {
	const hellBot = new HellBot(config);
	await hellBot.init();
})();
