'use client'

import { LaporanPendapatan } from '@/types/api/laporan'

export const RowPerubahan = ({ item }: { item: LaporanPendapatan['list_pendapatan'][number] }) => {
   const {
      nomor_urut,
      is_rinci,
      is_skpd,
      is_jumlah,
      kode,
      uraian,
      pendapatan_murni,
      pendapatan,
      selisih,
   } = item
   return (
      <tr
         key={nomor_urut}
         className={`${!is_rinci && 'font-bold'} ${(is_skpd || is_jumlah) && 'bg-foreground/5 print:bg:slate-100/10'} `}>
         {!(is_jumlah || is_skpd) && <td className='cell-print'>{kode}</td>}
         <td
            colSpan={is_rinci ? 1 : is_jumlah || is_skpd ? 5 : 4}
            className={`cell-print ${is_jumlah && 'text-right'}`}>
            {uraian}
         </td>
         {is_rinci && (
            <>
               <td className='cell-print'>1</td>
               <td className='cell-print'>Tahun</td>
               <td className='cell-print text-right'>
                  {pendapatan_murni?.harga?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
            </>
         )}
         <td className='cell-print text-right'>
            {pendapatan_murni?.total_harga_murni?.toLocaleString('id-ID', {
               maximumFractionDigits: 0,
               style: 'currency',
               currency: 'IDR',
            })}
         </td>
         {is_rinci ? (
            <>
               <td className='cell-print'>1</td>
               <td className='cell-print'>Tahun</td>
               <td className='cell-print text-right'>
                  {pendapatan?.total_harga?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
            </>
         ) : (
            <td
               colSpan={3}
               className='cell-print text-right'>
               {is_jumlah ? uraian : ''}
            </td>
         )}
         <td className='cell-print text-right'>
            {pendapatan?.total_harga?.toLocaleString('id-ID', {
               maximumFractionDigits: 0,
               style: 'currency',
               currency: 'IDR',
            })}
         </td>
         <td className='cell-print text-right'>
            {selisih?.toLocaleString('id-ID', {
               maximumFractionDigits: 0,
               style: 'currency',
               currency: 'IDR',
            })}
         </td>
      </tr>
   )
}

export const TheadPerubahan = () => {
   return (
      <thead>
         <tr>
            <th
               rowSpan={3}
               className='cell-print'>
               Kode Rekening
            </th>
            <th
               rowSpan={3}
               className='cell-print'>
               Uraian
            </th>
            <th
               colSpan={4}
               className='cell-print'>
               Sebelum
            </th>
            <th
               colSpan={4}
               className='cell-print'>
               Sesudah
            </th>
            <th
               rowSpan={3}
               className='cell-print'>
               Bertambah (Berkurang) (Rp)
            </th>
         </tr>
         <tr>
            <th
               colSpan={3}
               className='cell-print'>
               Rincian
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Jumlah
            </th>
            <th
               colSpan={3}
               className='cell-print'>
               Rincian
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Jumlah
            </th>
         </tr>
         <tr>
            <th className='cell-print'>Volume</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Tarif / Harga</th>
            <th className='cell-print'>Volume</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Tarif / Harga</th>
         </tr>
      </thead>
   )
}

export const TheadMurni = () => {
   return (
      <thead>
         <tr>
            <th
               rowSpan={2}
               className='cell-print'>
               Kode Rekening
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Uraian
            </th>
            <th
               colSpan={3}
               className='cell-print'>
               Rincian
            </th>
            <th
               colSpan={2}
               className='cell-print'>
               Jumlah (Rp.)
            </th>
         </tr>
         <tr>
            <th className='cell-print'>Volume</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Tarif / Harga</th>
         </tr>
      </thead>
   )
}

export const RowMurni = ({ item }: { item: LaporanPendapatan['list_pendapatan'][number] }) => {
   const { nomor_urut, is_rinci, is_skpd, is_jumlah, uraian, pendapatan, kode } = item
   return (
      <tr
         key={nomor_urut}
         className={`${!is_rinci && 'font-bold'} ${(is_skpd || is_jumlah) && 'bg-foreground/5 print:bg:slate-100/10'} `}>
         {!(is_jumlah || is_skpd) && <td className='cell-print'>{kode}</td>}
         <td
            colSpan={is_rinci ? 1 : is_jumlah || is_skpd ? 5 : 4}
            className={`cell-print ${is_jumlah && 'text-right'}`}>
            {uraian}
         </td>
         {is_rinci && (
            <>
               <td className='cell-print'>1</td>
               <td className='cell-print'>Tahun</td>
               <td className='cell-print text-right'>
                  {pendapatan?.total_harga?.toLocaleString('id-ID', {
                     maximumFractionDigits: 0,
                     style: 'currency',
                     currency: 'IDR',
                  })}
               </td>
            </>
         )}
         <td className='cell-print text-right'>
            {pendapatan?.total_harga?.toLocaleString('id-ID', {
               maximumFractionDigits: 0,
               style: 'currency',
               currency: 'IDR',
            })}
         </td>
      </tr>
   )
}
