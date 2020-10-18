#!/usr/bin/node
require('dotenv').config();
process.env.APP_ROOT = __dirname;

const HellBot = require('./src/hellbot');
const config = require('./config.json');

new HellBot(config).run();
