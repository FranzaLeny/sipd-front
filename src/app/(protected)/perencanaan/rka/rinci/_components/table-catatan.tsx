'use client'

interface Props {
   printPreview?: boolean
}

export default function TableCatatan({ printPreview }: Props) {
   return (
      <table className={`table-catatan ${!printPreview && 'hidden print:table'} min-w-full `}>
         <tbody>
            <tr className='border'>
               <td className='w-40 px-3 py-0.5'>Pembahasan</td>
               <td className='px-2'>:</td>
            </tr>
            <tr className='border'>
               <td className='w-40 px-3 py-0.5'>Tanggal</td>
               <td className=' px-2 py-px'>:</td>
            </tr>
            <tr className='border'>
               <td className='w-40 px-3 py-0.5'>Catatan</td>
               <td className=' px-2'>:</td>
            </tr>
            <tr className='border'>
               <td
                  colSpan={2}
                  className='px-3 py-0.5'>
                  1.
               </td>
            </tr>
            <tr className='border'>
               <td
                  colSpan={2}
                  className='px-3 py-0.5'>
                  2.
               </td>
            </tr>
            <tr className='border'>
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
