#!/usr/bin/node

const HellBot = require('./hellbot');
const config = require('./config.json');
const tokens = require('./tokens.json');

const hellBot = new HellBot(config, tokens);
hellBot.run();