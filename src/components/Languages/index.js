import React from 'react'
import { navigate } from 'gatsby'
import { useLocale } from '../../hooks/locale'
import useLanguageMapping from '../useLanguageMapping'

import * as S from './styled'

const Languages = () => {
    // Grab the locale (passed through context) from the Locale Provider
    // through useLocale() hook
    const { locale } = useLocale()

    const languageMapping = useLanguageMapping()

    function handleClickLanguage(e, lang) {
        e.preventDefault()
        if (locale === lang) return
        // console.log('window', window)
        // console.log('window.location', window.location)
        // console.log('window.location.pathname', window.location.pathname)
        // console.log(
        //     'window.location.pathname.split',
        //     window.location.pathname.split('/')
        // )
        // console.log(
        //     'window.location.pathname.split.pop()',
        //     window.location.pathname.split('/').pop()
        // )
        const url = window.location.pathname.split('/').pop()

        if (!url) return lang === 'en' ? navigate(`/`) : navigate(`/${lang}`)
        // console.log('url', url)
        const associatedUrls = languageMapping.find(item => {
            let hasUrl = false
            // console.log('item', item)
            Object.entries(item).forEach(([key, value]) => {
                if (value.split('/').pop() === url) return (hasUrl = true)
            })

            return hasUrl
        })
        console.log('associatedUrls', associatedUrls)
        if (!associatedUrls) return navigate('/')

        const singleSlashSlug = associatedUrls[lang].replace(/\/\//g, '/')
        return lang === 'en'
            ? navigate(singleSlashSlug)
            : navigate(`/${lang}${singleSlashSlug}`)
    }

    return (
        <S.LanguageWrapper>
            <S.LanguageItem>
                <S.LanguageLink
                    to="/"
                    onClick={e => handleClickLanguage(e, 'en')}
                    className={locale === 'en' ? 'is-active' : ''}
                >
                    EN
                </S.LanguageLink>
            </S.LanguageItem>
            <S.LanguageItem>
                <S.LanguageLink
                    to="/"
                    onClick={e => handleClickLanguage(e, 'jp')}
                    className={locale === 'jp' ? 'is-active' : ''}
                >
                    JP
                </S.LanguageLink>
            </S.LanguageItem>
        </S.LanguageWrapper>
    )
}

export default Languages
