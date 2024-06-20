'use client'

import { useRouter } from 'next/navigation'
import { NextUIProvider, NextUIProviderProps } from '@nextui-org/react'
import { useLocale } from '@react-aria/i18n'

import { useSidebar } from './sidebar-provider'

export const UiProvider: React.FC<Omit<NextUIProviderProps, 'navigate' | 'locale'>> = ({
   children,
   ...props
}) => {
   const { isSidebarOpen } = useSidebar()
   const router = useRouter()
   const { direction, locale } = useLocale()
   return (
      <NextUIProvider
         {...props}
         data-sidebar-open={isSidebarOpen}
         // navigate={router.push}
         navigate={(path: string) => router.push(path, { scroll: false })}
         locale={locale}>
         {children}
      </NextUIProvider>
   )
}
