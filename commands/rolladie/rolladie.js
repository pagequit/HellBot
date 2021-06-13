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
				result.string = `[ ${result.value} ]`;

				return result;
			}

			let quiantifier = arg[0];
			const die = arg.substr(2);
			while(quiantifier-- > 0) {
				const value = this.rollDie(die);
				result.value += value;
				result.string += `[ ${value} ]`;
			}

			return result;
		}

		const result = formula.reduce((acc, cur) => {
			const resObj = resolve.call(this, cur);
			acc.sum += resObj.value;
			acc.string += `, ${resObj.string}`;
			return acc;
		}, {
			sum: 0,
			string: '',
		});

		return `Σ( ${result.sum} )` + result.string;
	}

	async execute(args, message) {
		const prismaUser = await this.$prisma.getPrismaUserById(message.author.id);
		const locale = prismaUser.locale;

		if (args.length < 1) {
			return message.reply(this.rollDie(6));
		}

		if (args.some(a => [...a.matchAll(/^\d?d\d+$/g)].length < 1)) {
			return Promise.reject(new CommandRejection(message, {
				reason: `${this.domain}.invalidFormular`,
				args: [args.join(' ')],
			}));
		}

		message.reply(this.parseFormula(args));
	}
}

module.exports = RollADie;
