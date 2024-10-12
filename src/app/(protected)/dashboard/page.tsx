'use client'

import dynamic from 'next/dynamic'

import { CardBalance1 } from './card-balance1'
import { CardBalance2 } from './card-balance2'

const Chart = dynamic(() => import('./charts/realisasi'), {
   loading: () => <p>Loading</p>,
   ssr: false,
})
const CardAgents = dynamic(() => import('./card-agents'), {
   loading: () => <p>Loading</p>,
   ssr: false,
})
const CardTransactions = dynamic(() => import('./card-transactions'), {
   loading: () => <p>Loading</p>,
   ssr: false,
})

const Page = () => (
   <div className='mx-auto flex min-w-full flex-col gap-4 p-4 sm:p-6 lg:grid lg:grid-cols-3 lg:gap-6 xl:p-6'>
      <div className='flex flex-col gap-6 md:col-span-2'>
         <div className='flex flex-col gap-2'>
            <h3 className='text-xl font-semibold'>Statistik</h3>
            <div className='bg-content1 max-w-full rounded-2xl p-6 shadow-lg '>
               <Chart />
            </div>
         </div>
         <div className='flex flex-col gap-2'>
            <h3 className='text-xl font-semibold'>Data</h3>
            <div className='grid w-full grid-cols-1 justify-center gap-5  md:grid-cols-2 2xl:grid-cols-3'>
               <CardBalance1 />
               <CardBalance2 />
            </div>
         </div>
      </div>
      <div className='flex flex-col gap-2 xl:max-w-md'>
         <div className='flex flex-col flex-wrap items-stretch justify-around gap-4 md:flex-col md:flex-nowrap'>
            <CardAgents />
            <CardTransactions />
         </div>
      </div>
   </div>
)

export default Page
