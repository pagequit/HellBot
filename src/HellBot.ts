import * as fs from 'node:fs';
import { Client } from 'discord.js';
import { Command } from './interfaces';

export default class HellBot extends Client {
	commands: Map<string, Command>;

	mountCommands() {
		this.commands = new Map();
		const commandsDir = __dirname + '/commands';
		const commandsNames = fs.readdirSync(commandsDir);

		for (const name of commandsNames) {
			import(`${commandsDir}/${name}/index.js`).then(Command => {
				this.commands.set(name, new Command.default());
			});
		}
	}
}
