import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { signOut, useSession } from 'next-auth/react'
import { clearCookies } from '@shared/server-actions/revalidate'

const Profile = () => {
   const [isOpen, setIsOpen] = useState(false)
   const { data, status } = useSession()
   const user = useMemo(() => data?.user, [data?.user])
   const router = useRouter()
   useEffect(() => {
      if (status === 'authenticated') {
         localStorage.setItem('x-sipd-ri', JSON.stringify(user))
      } else if (status === 'unauthenticated') {
         localStorage.removeItem('x-sipd-ri')
      }
   }, [user, status])
   const logout = async () => {
      await signOut({ redirect: false })
      localStorage.clear()
      await clearCookies()
      router.replace('/', { scroll: false })
      setIsOpen(false)
   }
   const goToProfile = () => {
      router.push('/profile')
      setIsOpen(false)
   }
   return (
      <>
         <Popover
            placement='bottom'
            shouldCloseOnBlur
            isOpen={isOpen}
            onOpenChange={setIsOpen}>
            <PopoverTrigger>
               <Button
                  variant='bordered'
                  radius='full'
                  isIconOnly>
                  <Avatar
                     size='sm'
                     isBordered
                     showFallback
                     name={user?.name ?? 'FX'}
                     src={user?.image ? `${user?.image}?alt=media` : undefined}
                  />
               </Button>
            </PopoverTrigger>
            <PopoverContent>
               <div className='text-foreground flex flex-col items-center gap-2 py-2'>
                  <Avatar
                     alt='avatar'
                     size='lg'
                     isBordered
                     color='secondary'
                     showFallback
                     isFocusable
                     src={user?.image ? `${user?.image}?alt=media` : undefined}
                  />
                  <div>
                     <p className='text-center font-semibold uppercase'>{user?.jabatan}</p>
                     <p className='text-center font-semibold'>{user?.nama}</p>
                     <p className='text-foreground-500 text-center'>{user?.nip}</p>
                  </div>
               </div>
               <div className='flex w-full justify-between gap-2'>
                  {status === 'authenticated' && (
                     <>
                        <Button
                           size='sm'
                           fullWidth
                           color='primary'
                           onPress={goToProfile}>
                           Profile
                        </Button>
                        <Button
                           fullWidth
                           size='sm'
                           color={'danger'}
                           onPress={logout}>
                           {'Keluar'}
                        </Button>
                     </>
                  )}
               </div>
            </PopoverContent>
         </Popover>
      </>
   )
}

export default Profile
