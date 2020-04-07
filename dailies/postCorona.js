module.exports = function postCorona() {
    this.commands.find(command => command.trigger.includes('corona')).execute(
        null,
        { channel: this.guild.systemChannel }
    );
}