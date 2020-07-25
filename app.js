#!/usr/bin/node

const HellBot = require('./hellbot');
const config = require('./config.json');
const tokens = require('./tokens.json');

new HellBot({config, tokens}).run();