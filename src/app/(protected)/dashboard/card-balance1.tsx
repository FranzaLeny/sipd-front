import { Card, CardBody } from '@nextui-org/react'
import { Users } from 'lucide-react'

export const CardBalance1 = () => {
   return (
      <Card className='bg-primary w-full rounded-xl px-3 shadow-md xl:max-w-sm'>
         <CardBody className='py-5'>
            <div className='flex gap-2.5'>
               <Users />
               <div className='flex flex-col'>
                  <span className='text-white'>Auto Insurance</span>
                  <span className='text-xs text-white'>1311 Cars</span>
               </div>
            </div>
            <div className='flex items-center gap-2.5 py-2'>
               <span className='text-xl font-semibold text-white'>$45,910</span>
               <span className='text-success text-xs'>+ 4.5%</span>
            </div>
            <div className='flex items-center gap-6'>
               <div>
                  <div>
                     <span className='text-success text-xs font-semibold'>{'↓'}</span>
                     <span className='text-xs text-white'>100,930</span>
                  </div>
                  <span className='text-xs text-white'>USD</span>
               </div>

               <div>
                  <div>
                     <span className='text-danger text-xs font-semibold'>{'↑'}</span>
                     <span className='text-xs text-white'>54,120</span>
                  </div>
                  <span className='text-xs text-white'>USD</span>
               </div>

               <div>
                  <div>
                     <span className='text-danger text-xs font-semibold'>{'⭐'}</span>
                     <span className='text-xs text-white'>125</span>
                  </div>
                  <span className='text-xs text-white'>VIP</span>
               </div>
            </div>
         </CardBody>
      </Card>
   )
}
