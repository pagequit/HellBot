const Task = require('../../src/task');
const mcping = require('mcping-js');

class ChickenBane extends Task {
    constructor() {
        super();
        this.cronTime = '* * * * * *';
        //this.cronTime = '00 00 */6 * * *';
        this.server = new mcping.MinecraftServer('94.250.205.219', '25565');
        this.$store.set('KFC', {
            state: 'offline',
        });
    }

    task(hellBot) {
        const KFC = this.$store.get('KFC');
        const channel = this.$store.get('guild').channels.cache.find(c => c.name === 'minecraft');
        let color = null;

        this.server.ping(1024, 751, (err, res) => {
            if (err) {
                let color = 0xe91e63;
                KFC.state = 'offline';
            }
            else if (res) {
                KFC.state = 'online';
            }
            channel.send({
                embed: {
                    color: color || 0x1abc9c,
                    title: 'KFC',
                    description: KFC.state,
                    thumbnail: {
                        url: `https://vignette.wikia.nocookie.net/minecraft/images/a/a7/CookedChickenNew.png/revision/latest?cb=20190901212217`,
                    },
                    timestamp: new Date(),
                }
            });
        });
    }
}

module.exports = ChickenBane;
