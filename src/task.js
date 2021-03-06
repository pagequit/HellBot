const CronJob = require('cron').CronJob;

class Task {
	constructor() {
		this.cronTime = '00 00 00 * * *';
		this.cronJob = null;
	}

	task(hellBot) {
		throw new Error('Try to run task from abstract Task!');
	}

	run(hellBot) {
		new CronJob(
			this.cronTime,
			this.task.bind(this, hellBot)
		).start();
	}
}

module.exports = Task;
