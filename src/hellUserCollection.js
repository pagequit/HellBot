const { Collection } = require('discord.js');
const HellUser = require('../entities/hellUser');

class HellUserCollection extends Collection {
    constructor(hellBot, args) {
        super(args);
        this.hellBot = hellBot;
    }

    get(key) {
        if (!this.has(key)) {
            this.set(key, new HellUser(this.hellBot, key));
        }

        return super.get(key);
    }
}

module.exports = HellUserCollection;