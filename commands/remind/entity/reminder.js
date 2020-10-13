module.exports = function Reminder(data) {
    this.title = data.title;
    this.timestamp = data.timestamp;
    this.hookk = data.hook; // this might be a nice feature in the future :D
}