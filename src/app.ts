#!/usr/bin/node
require('dotenv').config();
import { Intents } from 'discord.js';
import HellBot from './HellBot';

const hellBot = new HellBot({ intents: [Intents.FLAGS.GUILDS] });

hellBot.once('ready', () => {
	console.log(`Logged in as: ${hellBot.user.tag}`);
});

hellBot.login(process.env.DISCORD_KEY);
