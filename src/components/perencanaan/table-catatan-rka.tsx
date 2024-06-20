'use client'

import { cn } from '@nextui-org/react'

interface Props {
   printPreview?: boolean
   className?: string
}

export default function TableCatatanRka({ printPreview = true, className }: Props) {
   return (
      <table
         className={cn(
            !printPreview && 'hidden print:table',
            'min-w-full leading-tight',
            className
         )}>
         <tbody>
            <tr className='border-print'>
               <td className='w-40 px-3 py-0.5 print:border-black'>Pembahasan</td>
               <td className='px-2'>:</td>
            </tr>
            <tr className='border-print'>
               <td className='w-40 px-3 py-0.5'>Tanggal</td>
               <td className=' px-2 py-px'>:</td>
            </tr>
            <tr className='border-print'>
               <td className='w-40 px-3 py-0.5'>Catatan</td>
               <td className=' px-2'>:</td>
            </tr>
            <tr className='border-print'>
               <td
                  colSpan={2}
                  className='px-3 py-0.5'>
                  1.
               </td>
            </tr>
            <tr className='border-print'>
               <td
                  colSpan={2}
                  className='px-3 py-0.5'>
                  2.
               </td>
            </tr>
            <tr className='border-print'>
               <td
                  colSpan={2}
                  className='px-3 py-0.5'>
                  dst.
               </td>
            </tr>
         </tbody>
      </table>
   )
}
