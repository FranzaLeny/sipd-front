'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebar } from '@/providers/sidebar-provider'
import { Button, cn } from '@nextui-org/react'
import { useIsMobile } from '@nextui-org/use-is-mobile'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useSession } from '@shared/hooks/use-session'

import LogoDaerah from './logo-lembata'
import SideMenu from './side-menu'

const CLOSED_WIDTH = '0px'
const OPEN_WIDTH = 'var(--sidebar-width)'
const SidebarVariants = {
   open: {
      width: OPEN_WIDTH,
      transition: {
         // tipe: 'inertia',
         stiffness: 0,
         damping: 0,
         duration: 0.1,
      },
   },
   closed: {
      width: CLOSED_WIDTH,
      transition: {
         damping: 0,
         duration: 0.2,
      },
   },
}

const LogoVariants = {
   open: {
      x: '0%',
      display: 'flex',
      transition: { damping: 0, duration: 0.1 },
   },
   closed: {
      x: '-100%',
      display: 'none',
      transition: { damping: 0, duration: 0.1 },
   },
}

const MenuVariants = {
   open: {
      width: OPEN_WIDTH,
      display: 'flex',
      x: '0%',
      transition: { damping: 0, duration: 0.1 },
   },
   closed: {
      width: CLOSED_WIDTH,
      x: '100%',
      display: 'none',
      transition: { damping: 0, duration: 0.1 },
   },
}

export const Sidebar = () => {
   const isMobile = useIsMobile()
   const { isSidebarOpen, setIsSidebarOpen } = useSidebar()
   const [visibility, setVisibility] = useState<'closed' | 'open'>(
      isSidebarOpen ? 'open' : 'closed'
   )
   const { status } = useSession()

   const toggleSidebar = () => setIsSidebarOpen((v) => !v)

   useEffect(() => {
      setVisibility(isSidebarOpen ? 'open' : 'closed')
   }, [isSidebarOpen])
   // HACK tutup sidebar saat menu diklik untuk mobile
   const pathname = usePathname()

   useEffect(() => {
      if (isMobile) {
         setIsSidebarOpen(false)
      }
   }, [setIsSidebarOpen, pathname, isMobile])

   const Brand = (
      <div className='w-sidebar flex h-full items-center justify-center gap-2 justify-self-end overflow-visible pr-[calc(var(--height-navbar)+6px)]'>
         <div className='w-navbar relative h-[calc(var(--height-navbar)-16px)]'>
            <LogoDaerah
               aria-label='Logo Daerah'
               quality={20}
               objectFit='contain'
               layout='fill'
               loading='eager'
            />
         </div>
         <Link
            href='/'
            scroll={false}
            className='flex-1 flex-nowrap whitespace-nowrap text-2xl font-bold'>
            <span className='whitespace-nowrap text-red-700'>DLH-</span>Lembata
         </Link>
      </div>
   )
   if (status !== 'authenticated') {
      return <></>
   }
   return (
      <>
         {/* HACK tutup sidebar saat di mobile */}
         {isSidebarOpen && (
            <div
               onClick={toggleSidebar}
               tabIndex={-1}
               className='fixed inset-0 z-[49] h-full w-dvw sm:absolute sm:-z-50 sm:hidden sm:size-0'
            />
         )}
         <motion.aside
            tabIndex={isSidebarOpen ? 0 : -1}
            aria-hidden={!isSidebarOpen}
            className='max-w-dvw from-content1 to-background/70 fixed left-0 top-0 z-50 flex h-dvh flex-col bg-gradient-to-r transition-none backdrop:blur sm:sticky sm:z-30'
            variants={SidebarVariants}
            animate={visibility}
            initial={visibility}>
            <header
               aria-hidden={!isSidebarOpen}
               className='h-navbar relative flex backdrop-blur aria-hidden:bg-transparent'>
               <motion.div
                  variants={LogoVariants}
                  className='h-full max-w-full flex-1 overflow-hidden p-3'>
                  {isSidebarOpen && Brand}
               </motion.div>
               <motion.div
                  className={cn(
                     'h-navbar absolute flex items-center justify-center transition-transform duration-75',
                     isSidebarOpen ? 'right-0 px-3' : 'right-full translate-x-full px-6'
                  )}>
                  <Button
                     size='md'
                     aria-hidden={false}
                     tabIndex={0}
                     id='sidebarToggle'
                     aria-pressed='true'
                     aria-label={isSidebarOpen ? 'Tutup menu' : 'Buka menu'}
                     radius='full'
                     aria-controls='sidebar'
                     variant='bordered'
                     title={isSidebarOpen ? 'Tutup menu' : 'Buka menu'}
                     isIconOnly
                     onClick={toggleSidebar}>
                     {isSidebarOpen ? <X /> : <Menu />}
                  </Button>
               </motion.div>
            </header>
            <motion.nav
               layout
               variants={MenuVariants}
               role='tree'
               className={`flex h-fit max-h-full max-w-screen-sm flex-1 flex-col overflow-auto transition-none ${isSidebarOpen ? 'px-3 pb-8 pt-6' : 'p-0'}`}>
               {isSidebarOpen && <SideMenu />}
            </motion.nav>
            <motion.footer
               variants={MenuVariants}
               className='text-small flex h-fit w-full flex-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap backdrop-blur'>
               <div>
                  &copy; 2023 <span className='text-red-700'>❤</span> FXIL
               </div>
            </motion.footer>
         </motion.aside>
      </>
   )
}

export default Sidebar
