const Task = require('../../src/task');
const mcping = require('mcping-js');

class ChickenBane extends Task {
	constructor() {
		super();
		this.cronTime = '00 */1 * * * *';
		this.server = new mcping.MinecraftServer('94.250.205.219', '25565');
		this.$store.set('KFC', {
			state: 'offline',
		});
	}

	task(hellBot) {
		return; // DELETE ME!!!
		const KFC = this.$store.get('KFC');
		const channel = this.$store.get('guild').channels.cache.find(c => c.name === 'minecraft');

		this.server.ping(1024, 751, (err, res) => {
			if (err && KFC.state === 'online') {
				KFC.state = 'offline';
				channel.send({
					embed: {
						color: 0xe91e63,
						title: 'KFC',
						description: KFC.state,
						thumbnail: {
							url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/9/98/Barrier_JE2_BE2.png/revision/latest',
						},
						timestamp: new Date(),
					}
				});
			}
			else if (res && KFC.state === 'offline') {
				KFC.state = 'online';
				channel.send({
					embed: {
						color: 0x1abc9c,
						title: 'KFC',
						description: KFC.state,
						thumbnail: {
							url: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/66/Cooked_Chicken_JE3_BE3.png/revision/latest',
						},
						timestamp: new Date(),
					}
				});
			}
		});
	}
}

module.exports = ChickenBane;
