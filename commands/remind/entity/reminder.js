const CronJob = require('cron').CronJob;

module.exports = function Reminder(data) {
    const date = new Date();
    this.date = date.setMinutes(date.getMinutes() + data.minutes);
    this.subject = data.subject;
    this.hellUser = data.hellUser;
}

Reminder.prototype = {
    start({ ext }) {
        new CronJob(this.date, () => {
            const user = ext.$store.get('guild').members.cache
                .find(m => m.id === this.hellUser.id).user;
            
            user.send(ext.$i18n.t(this.user.locale, 'remmind.default', [user.username, this.subject]));
        });
    },
}