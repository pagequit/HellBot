const fs = require('fs');

module.exports = {
    assignLocale: (locale, folder) => {
        const localeFiles = fs.readdirSync(folder)
            .filter(f => f.endsWith('.json'))
        ;
        
        for (const fileName of localeFiles) {
            const lacaleJSON = require(`${folder}/${fileName}`);
            const localeISO = fileName.substr(0, 2);
            locale.set(localeISO, lacaleJSON);
        }
    }
}