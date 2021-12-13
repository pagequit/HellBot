import * as fs from 'node:fs';
import { Client, ClientOptions } from 'discord.js';
import { HellConfig } from '../hell.config';
import BaseCommand from './abstracts/BaseCommand';

export default class HellBot extends Client {
	config: HellConfig;
	commands: Map<string, BaseCommand>;

	constructor(config: HellConfig, options: ClientOptions) {
		super(options);

		this.config = config;
	}

	mountCommands(): void {
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
