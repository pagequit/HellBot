function HellUser(i18n, id) {
    this.id = id;
    this.i18n = i18n;
    this._locale = {
        fallback: i18n.fallback,
        current: i18n.fallback,
    }
}

Object.defineProperty(HellUser.prototype, 'locale', {
    get: function() {
        return this._locale.current;
    },
    set: function(value) {
        if (this.i18n.has(value)) { // why does the hellUser should care about i18n locale definitions :thinking:
            this._locale.current = value;
        }
    },
});

module.exports = HellUser;