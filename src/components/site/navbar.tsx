'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar as Nav, NavbarContent, NavbarItem } from '@nextui-org/react'
import { useSession } from '@shared/hooks/use-session'

import Profile from './profile'

const ThemeSwitch = dynamic(() => import('./theme-switch'), { ssr: false })
const TahunSetting = dynamic(() => import('./tahun-setting'), { ssr: false })

type NabarProps = {}

const Navbar: React.FC<NabarProps> = ({}) => {
   const { status } = useSession()
   const [title, setTitle] = useState('')
   const pathname = usePathname()
   useEffect(() => {
      const timeoutId = setTimeout(() => {
         const _title = document?.title || ''
         const isError = _title.split(':')?.length > 1
         if (isError) {
            setTitle('')
         } else {
            setTitle(_title)
         }
      }, 200)
      return () => clearTimeout(timeoutId)
   }, [pathname])

   return (
      <Nav
         position='sticky'
         maxWidth='full'
         /* HACK "UBAH" "height-navbar" dan "z-index navbar" */
         className='z-10 flex-none'
         height='calc(var(--height-navbar))'>
         {status === 'authenticated' && (
            <NavbarContent
               className='group-data-[sidebar-open=false]/layout:ml-navbar gap-4 px-2 transition-all'
               justify='start'>
               <NavbarItem className='max-w-32 truncate text-lg font-bold sm:max-w-96'>
                  {title}
               </NavbarItem>
            </NavbarContent>
         )}
         <NavbarContent justify='end'>
            {status === 'unauthenticated' ? (
               <>
                  <NavbarItem>
                     <Link
                        color='foreground'
                        href='/#home'>
                        Home
                     </Link>
                  </NavbarItem>
                  <NavbarItem>
                     <Link
                        href='/#about'
                        aria-current='page'>
                        Tentang
                     </Link>
                  </NavbarItem>
                  <NavbarItem>
                     <Link
                        color='foreground'
                        href='/#contacts'>
                        Kontak
                     </Link>
                  </NavbarItem>
               </>
            ) : (
               <NavbarItem>
                  <TahunSetting />
               </NavbarItem>
            )}
            <NavbarItem>
               <ThemeSwitch />
            </NavbarItem>
            {status === 'authenticated' && (
               <NavbarItem>
                  <Profile />
               </NavbarItem>
            )}
         </NavbarContent>
      </Nav>
   )
}

export default Navbar
