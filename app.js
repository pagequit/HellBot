#!/usr/bin/node

const HellBot = require('./src/hellbot');
const config = require('./config.json');
const tokens = require('./tokens.json');

new HellBot(config, tokens, __dirname).run();