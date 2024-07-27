export default function TableGiat({
   children,
   printPreview,
}: {
   children: React.ReactNode
   printPreview: boolean
}) {
   return (
      <table className={`min-w-full ${!printPreview && 'hidden print:table'}`}>
         <thead>
            <tr className='border-print font-semibold'>
               <th
                  colSpan={3}
                  className='py-1 text-center'>
                  Rincian Anggaran Belanja Menurut Program dan Kegiatan
               </th>
            </tr>
         </thead>
         <tbody className='align-top'>{children}</tbody>
      </table>
   )
}
