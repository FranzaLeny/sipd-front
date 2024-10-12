import type { Metadata } from 'next'
import I18nProvider from '@/providers/I18n-provider'
import Navbar from '@components/site/navbar'
import Sidebar from '@components/site/sidebar'
import { siteConfig } from '@constants/site-config'

import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

import { Providers } from './providers'

export const metadata: Metadata = {
   title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
   },
   description: siteConfig.description,
   keywords: ['SIPD', 'DLH', 'Lembata', 'SIPD-RI-Lokal'],
   creator: siteConfig.creator,
}

export const viewport = {
   width: 1,
   themeColor: [
      { media: '(prefers-color-scheme: light)', color: 'white' },
      { media: '(prefers-color-scheme: dark)', color: 'black' },
   ],
}
interface RootLayoutProps {
   children: React.ReactNode
   modal: React.ReactNode
}
const RootLayout = async ({ children, modal }: RootLayoutProps) => {
   return (
      <html
         lang='en-US'
         dir='ltr'>
         <I18nProvider locale='id'>
            <body>
               <Providers
                  className='bg-background text-foreground group/layout relative mx-auto flex h-dvh min-h-dvh justify-center overflow-hidden antialiased transition-all duration-200 2xl:data-[sidebar-open=false]:max-w-[100rem] 2xl:data-[sidebar-open=true]:max-w-[calc(96rem+var(--sidebar-width))]'
                  themeProps={{ attribute: 'class', defaultTheme: 'system' }}>
                  <Sidebar />
                  <div className='relative z-0 mx-auto flex max-h-full w-full max-w-[1600] flex-1 flex-col overflow-auto'>
                     <Navbar />
                     {children}
                     {modal}
                  </div>
               </Providers>
            </body>
         </I18nProvider>
      </html>
   )
}

export default RootLayout
