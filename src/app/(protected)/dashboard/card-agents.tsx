import { Avatar, AvatarGroup, Card, CardBody } from '@nextui-org/react'

export const CardAgents = () => {
   return (
      <Card className='w-full rounded-xl px-4 py-6 shadow-md'>
         <CardBody className='gap-6 py-5'>
            <div className='flex justify-center gap-2.5'>
               <div className='border-divider flex flex-col rounded-xl border-2 border-dashed px-6 py-2'>
                  <span className='text-default-900 text-xl font-semibold'> {'⭐'}User</span>
               </div>
            </div>

            <div className='flex flex-col items-center gap-6'>
               <span className='text-xs'>Daftar pegawai yang sedang aktif</span>
               <AvatarGroup isBordered>
                  <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026024d' />
                  <Avatar src='https://i.pravatar.cc/150?u=a04258a2462d826712d' />
                  <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026704d' />
                  <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026302d' />
                  <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026702d' />
                  <Avatar src='https://i.pravatar.cc/150?u=a04258114e29026708c' />
               </AvatarGroup>
            </div>
         </CardBody>
      </Card>
   )
}

export default CardAgents
