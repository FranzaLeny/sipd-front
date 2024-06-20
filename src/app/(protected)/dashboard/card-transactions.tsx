'use client'

import { Card, CardBody, User } from '@nextui-org/react'

const items = [
   {
      name: 'Nama Pegawai DInas Lingkungan Hidup',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      amount: '4500 USD',
      date: '9/20/2021',
   },
   {
      name: 'Nama Pegawai',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      amount: '4500 USD',
      date: '9/20/2021',
   },
   {
      name: 'Nama Pegawai',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      amount: '4500 USD',
      date: '9/20/2021',
   },
   {
      name: 'Nama Pegawai',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      amount: '4500 USD',
      date: '9/20/2021',
   },
   {
      name: 'Nama Pegawai',
      picture: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      amount: '4500 USD',
      date: '9/20/2021',
   },
]

export const CardTransactions = () => {
   return (
      <Card className='derounded-xl px-3 shadow-md'>
         <CardBody className='gap-4 py-5'>
            <div className='flex justify-center gap-2.5'>
               <div className='border-divider flex flex-col rounded-xl border-2 border-dashed px-6 py-2'>
                  <span className='text-default-900 text-xl font-semibold'>Pegawai DLH</span>
               </div>
            </div>

            <div className='flex flex-col items-start justify-start gap-6 '>
               {items.map((item, i) => (
                  <User
                     key={i}
                     name={item.name}
                     description={item.date}
                     avatarProps={{
                        src: item?.picture,
                     }}
                  />
               ))}
            </div>
         </CardBody>
      </Card>
   )
}

export default CardTransactions
