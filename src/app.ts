#!/usr/bin/node
import * as dotenv from 'dotenv';
import { Intents } from 'discord.js';
import HellBot from './HellBot';

dotenv.config();
const hellBot = new HellBot({ intents: [Intents.FLAGS.GUILDS] });
hellBot.mountCommands();

hellBot.once('ready', () => {
	console.log(`Logged in as: ${hellBot.user.tag}`);
});

hellBot.login(process.env.DISCORD_KEY);
