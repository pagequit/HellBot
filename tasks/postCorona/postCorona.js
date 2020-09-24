const Task = require('../../src/task');

class PostCorona extends Task {
    constructor() {
        super();
        this.cronTime = '* * * * * *';
    }
    
    task({client}) {
        this.$store.get('guild').systemChannel.send('test');
    }
}

module.exports = PostCorona;