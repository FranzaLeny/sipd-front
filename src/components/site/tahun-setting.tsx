'use client'

import { useCallback, useMemo, useState } from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { useSession } from '@shared/hooks/use-session'
import { revalidateRoot } from '@shared/server-actions/revalidate'

const TAHUNLIST = Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2024 + i)
const TahunSetting = () => {
   const { data, update } = useSession()

   const user = useMemo(() => data?.user, [data?.user])
   const [isLoading, setIsLoading] = useState(false)

   const changeTahun = useCallback(
      async (tahun: number) => {
         if (!!user?.tahun && tahun && user.tahun !== tahun && !!update) {
            setIsLoading(true)
            try {
               await update({ tahun })
               await revalidateRoot()
            } catch (error) {}
            setIsLoading(false)
         }
      },
      [update, user?.tahun]
   )

   const tahun = useMemo(() => {
      if (user?.tahun) {
         return String(user.tahun)
      }
   }, [user?.tahun])
   return (
      <>
         {isLoading && <div className='h-dvw fixed inset-0 z-[60] w-full cursor-wait' />}
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
