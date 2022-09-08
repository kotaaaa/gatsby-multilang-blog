import React from 'react'
import useTranslations from '../useTranslations'
import SocialLinks from '../SocialLinks'

import * as S from './styled'

const Footer = () => {
    const { maintainedBy, licenseDisplay } = useTranslations()

    return (
        <S.FooterWrapper>
            <S.FooterContainer>
                <SocialLinks />
                <p>
                    {maintainedBy}{' '}
                    <a href="https://twitter.com/kotaaaa1110" target="_blank">
                        @kotaaaa1110
                    </a>
                    . {licenseDisplay}{' '}
                    <a href="https://github.com/kotaaaa" target="_blank">
                        Github
                    </a>
                    .
                </p>
            </S.FooterContainer>
        </S.FooterWrapper>
    )
}

export default Footer
