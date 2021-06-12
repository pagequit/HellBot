const { DataResolver } = require('discord.js');
const Command = require('../../src/command');
const CommandRejection = require('../../src/commandRejection');

class RollADie extends Command {
	constructor() {
		super();
		this.trigger.push('rolladie', 'roll', 'würfel');
		this.icon = ':game_die:';
		this.info.arguments.push('die');
	}

	rollDie(sides) {
		return Math.ceil(Math.random() * sides);
	}

	parseFormula(formula) {
		function resolve(arg) {
			const result = {
				value: 0,
				string: '',
			};

			if (arg[0] === 'd') {
				result.value = this.rollDie(arg.substr(1));
				result.string = `[${result.value}:${arg.substr(1)}]`;

				return result;
			}

			let quiantifier = arg[0];
			const die = arg.substr(2);
			while(quiantifier-- > 0) {
				const value = this.rollDie(die);
				result.value += value;
				result.string += `[${value}:${die}]`;
			}

			return result;
		}

		const regex = /^\d?d\d+$/g;
		const result = formula.reduce((acc, cur) => {
			if (!cur.match(regex)) {
				return;
			}
			const resObj = resolve.call(this, cur);
			acc.sum += resObj.value;
			acc.string += ` ${resObj.string}`;
			return acc;
		}, {
			sum: 0,
			string: '',
		});

		return `Σ(${result.sum})` + result.string;
	}

	async execute(args, message) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		switch(args.length) {
			case 0:
				message.reply(this.rollDie(6));
				break;

			case 1:
				const regex = /\d+/g;
				const matchesCount = [...args[0].matchAll(regex)].length;

				if (matchesCount !== 1) {
					return Promise.reject(new CommandRejection(message, {
						reason: `${this.domain}.invalidArg`,
						args: args,
					}));
				}

				message.reply(this.rollDie(args[0].match(regex)));
				break;

			default:
				message.reply(this.parseFormula(args));
		}
	}
}

module.exports = RollADie;
