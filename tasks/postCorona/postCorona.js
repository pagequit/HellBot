const Task = require('../../src/task');

class PostCorona extends Task {
    constructor() {
        super();
        this.cronTime = '00 00 06 * * *';
    }
    
    task(hellBot) {
        const command = hellBot.commands.find(c => c.trigger.includes('corona'));
        command.execute(null, {
            channel: this.$store.get('guild').systemChannel,
            author: {
                id: hellBot.client.user.id,
            }
        });
    }
}

module.exports = PostCorona;