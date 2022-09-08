// Only one item MUST have the "default: true" key

module.exports = {
    en: {
        default: true,
        path: `en`,
        locale: `en-US`,
        dateFormat: `DD/MM/YYYY`,
        siteLanguage: `en`,
        ogLanguage: `en_US`,
        defaultTitle: `Gatsby Starter with multi-language and CMS`,
        defaultDescription: `Gatsby example site using Markdown, i18n and CMS`,
    },
    jp: {
        path: `jp`,
        locale: `ja-JP`,
        dateFormat: `DD/MM/YYYY`,
        siteLanguage: `jp`,
        ogLanguage: `ja_JP`,
        defaultTitle: `Gatsby Starter multilingue com CMS`,
        defaultDescription: `Exemplo de Gatsby site usando Markdown, i18n e CMS`,
    },
}
