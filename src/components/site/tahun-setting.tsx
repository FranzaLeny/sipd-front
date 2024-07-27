'use client'

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useSession } from '@shared/hooks/use-session'

const TAHUNLIST = Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2024 + i)
const TahunSetting = () => {
   const { data, update } = useSession()

   const user = useMemo(() => data?.user, [data?.user])
   const router = useRouter()
   const changeTahun = useCallback(
      async (tahun: number) => {
         if (!!user?.tahun && tahun && user.tahun !== tahun && !!update) {
            try {
               await update({ tahun }).then(() => {
                  router.replace('/dashboard', { scroll: false })
               })
            } catch (e) {}
         }
      },
      [update, user?.tahun, router]
   )

   const tahun = useMemo(() => {
      if (user?.tahun) {
         return String(user.tahun)
      }
   }, [user?.tahun])
   return (
      <>
         <Dropdown
            radius='sm'
            className='w-fit min-w-0'
            placement='bottom-end'>
            <DropdownTrigger>
               <Button
                  aria-labelledby='tahun'
                  radius='sm'
                  isIconOnly
                  variant='light'>
                  {tahun}
               </Button>
            </DropdownTrigger>
            <DropdownMenu
               aria-label='Tahun'
               className='w-fit min-w-0'
               selectionMode='single'
               disabledKeys={tahun}
               defaultSelectedKeys={tahun}>
               {TAHUNLIST?.map((tahun) => (
                  <DropdownItem
                     onPress={() => changeTahun(tahun)}
                     textValue={tahun.toString()}
                     key={tahun}>
                     {tahun}
                  </DropdownItem>
               ))}
            </DropdownMenu>
         </Dropdown>
      </>
   )
}

export default TahunSetting
