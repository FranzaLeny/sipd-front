'use client'

import { I18nProviderProps, I18nProvider as ReactI18nProvider } from '@react-aria/i18n'

export const I18nProvider = ({ children, locale = 'id' }: I18nProviderProps) => {
   return <ReactI18nProvider locale={locale}>{children}</ReactI18nProvider>
}

export default I18nProvider
