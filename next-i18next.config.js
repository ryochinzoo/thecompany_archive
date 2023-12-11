const path = require('path')

module.exports = {
    i18n: {
        localeDetection: false,
        locales: ["de", "en"],
        defaultLocale: "en",
        /*
        localePath: path.resolve('./public/locales'),
        react: {
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
        }*/
    }
}