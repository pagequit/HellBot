const { Collection } = require('discord.js');
const fs = require('fs');

class I18nCollection extends Collection {
    constructor(fallback, args) {
        super(args);
        this.fallback = fallback;
    }

    t(locale, key, args = []) {
        locale = this.has(locale)
            ? this.get(locale)
            : this.fallback;
        ;

        let response = locale[key]
            || this.get(this.fallback)[key]
            || this.find(l => !!l[key])
            || `${key}`
        ;
    
        args.forEach((arg, idx) => {
            response = response.replace(`{${idx}}`, arg);
        });

        return response;
    }

    assignLocaleFiles(folder) {
        const localeFiles = fs.readdirSync(folder)
            .filter(f => f.endsWith('.locale.json'))
        ;
        
        for (const fileName of localeFiles) {
            const lacaleJSON = require(`${folder}/${fileName}`);
            const localeISO = fileName.substr(0, 2);
            if (this.has(localeISO)) {
                Object.assign(this.get(localeISO), localeJSON);
            }
            else {
                this.set(localeISO, lacaleJSON);
            }
        }
    }
}

module.exports = I18nCollection;