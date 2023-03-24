#!/usr/bin/node

import "dotenv/config";
import HellBot from "#core/HellCore";
import config from "./hell.config";

!(async function () {
    const hellBot = new HellBot(config);

    await hellBot.initialize();
    await hellBot.login();
    await hellBot.deployCommands();
})();
