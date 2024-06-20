'use client'

import { Tab, Tabs } from '@nextui-org/react'
import { IUser } from '@zod'

import CardSecuriy from './form-password'
import CardProfile from './form-profile'

export default function Template({
   user,
   revalidateProfile,
}: {
   user: IUser
   revalidateProfile: () => Promise<void>
}) {
   return (
      <div className='content mt-5'>
         <Tabs
            fullWidth
            // placement='top'
            radius='full'
            color='secondary'
            variant='bordered'>
            <Tab
               key='profil'
               id='profil'
               className='flex'
               title='Profile'>
               <CardProfile
                  revalidateProfile={revalidateProfile}
                  data={user}
               />
               <div className='hidden w-1/2 flex-col items-center justify-center gap-4 p-4 text-center lg:flex'>
                  <p className='font-bold'>Penjelasan</p>
                  <p className='flex flex-1 text-start '>
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo mollitia expedita
                     esse dolore similique aspernatur placeat. Eos doloremque tempore, minima cumque
                     suscipit perferendis tempora libero, ipsam maxime odio voluptatem earum.
                  </p>
               </div>
            </Tab>
            <Tab
               key='account'
               id='account'
               className='flex'
               title='Akun'>
               <div className='hidden w-1/2 flex-col items-center justify-center gap-4 p-4 text-center lg:flex'>
                  <p className='font-bold'>Penjelasan</p>
                  <p className='flex flex-1 text-start '>
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo mollitia expedita
                     esse dolore similique aspernatur placeat. Eos doloremque tempore, minima cumque
                     suscipit perferendis tempora libero, ipsam maxime odio voluptatem earum.
                  </p>
               </div>
               <CardSecuriy
                  revalidateProfile={revalidateProfile}
                  data={user}
               />
            </Tab>
         </Tabs>
      </div>
   )
}
