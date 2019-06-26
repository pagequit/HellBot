const HellBot = require('./hellbot');
const config = require('./config.json');

const hellBot = new HellBot(config);
hellBot.run();