interface Props {
   isPerubahan?: boolean
   printPreview: boolean
   tahun?: number
}

export default function TableKop({ isPerubahan, tahun, printPreview }: Props) {
   return (
      <table
         className={`min-w-full ${!printPreview && 'hidden print:table'} text-center font-bold`}>
         <tbody>
            <tr className='print:break-inside-avoid'>
               <td className='border-print whitespace-nowrap px-5'>
                  {isPerubahan ? (
                     <div>RENCANA KERJA DAN PERUBAHAN ANGGARAN</div>
                  ) : (
                     <div>RENCANA KERJA DAN ANGGARAN</div>
                  )}
                  <div>SATUAN KERJA PERANGKAT DAERAH</div>
               </td>
               <td className='border-print px-5 py-2'>
                  <div>Formulir</div>
                  {isPerubahan ? <div>RKPA-BELANJA</div> : <div>RKA-BELANJA</div>}
                  <div>SKPD</div>
               </td>
            </tr>
            <tr className='print:break-inside-avoid'>
               <td
                  colSpan={2}
                  className='border-print'>
                  Pemerintahan Kab. Lembata Tahun Anggaran{' '}
                  {tahun ? tahun : new Date().getFullYear()}
               </td>
            </tr>
         </tbody>
      </table>
   )
}
