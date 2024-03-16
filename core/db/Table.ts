import { Database, type Statement } from "bun:sqlite";

const db = new Database("db.sqlite", { create: true });

export default class Table<T extends {}> {
	readonly name: string;

	constructor(name: string, columns: Map<string, string>) {
		this.name = name;
		const sql = `CREATE TABLE IF NOT EXISTS ${name} (${[...columns].reduce(
			(acc, cur, idx) => {
				return `${acc}${cur[0]} ${cur[1]}${
					idx === columns.size - 1 ? "" : ", "
				}`;
			},
			"",
		)});`;
		db.run(sql);
	}

	insert(data: T): T {
		const columns = Object.keys(data);
		const values = Object.values(data);
		const placeholders = values.map((_, i) => `?${i + 1}`).join(", ");

		const sql = `INSERT INTO ${this.name} (${columns.join(
			", ",
		)}) VALUES (${placeholders});`;
		const query: Statement<T> = db.prepare(sql);
		query.run(values);

		return data;
	}

	findBy(column: string, value: string): T | null {
		const sql = `SELECT * FROM ${this.name} WHERE ${column} = ?`;
		const query: Statement<T> = db.prepare(sql);
		const result = query.get(value);

		return result;
	}

	updateBy(column: string, data: Partial<T>) {
		const updates = Object.entries(data).reduce((acc, cur, idx) => {
			return `${acc}${cur[0]} = '${cur[1]}'${
				idx === Object.keys(data).length - 1 ? "" : ", "
			}`;
		}, "");

		const sql = `UPDATE ${this.name} SET ${updates} WHERE ${column} = ?`;
		const query: Statement<T> = db.prepare(sql);
		// @ts-ignore
		query.run(data[column]);
	}
}
