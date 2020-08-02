function HellUser({ store, i18n }, id) {
    this.id = id;
    this.i18n = i18n;
    this._locale = {
        fallback: store.get('config').localeFallback,
        current: store.get('config').localeFallback,
    }
}

Object.defineProperty(HellUser.prototype, 'locale', {
    get: function() {
        return this._locale.current;
    },
    set: function(value) {
        this._locale.current = this.i18n.has(value)
            ? value
            : this._locale.fallback
        ;
    },
});

module.exports = HellUser;