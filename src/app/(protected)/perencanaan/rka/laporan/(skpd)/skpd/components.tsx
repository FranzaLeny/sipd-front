'use client'

import { numberToRupiah } from '@utils'
import { LaporanSkpd } from '@/types/api/laporan'

export const TheadMurni = () => (
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
            colSpan={2}
            className='cell-print'>
            Jumlah (Rp)
         </th>
      </tr>
   </thead>
)

export const TbodyMurni = ({ items = [] }: { items: LaporanSkpd['list_rekapan'] }) => {
   const totalBelanja = items?.find((item) => item?.kode_akun === '5')?.total_harga || 0
   const totalPendapatan = items?.find((item) => item?.kode_akun === '4')?.total_harga || 0
   const totalPenerimaanPembiayaan =
      items?.find((item) => item?.kode_akun === '6.1')?.total_harga || 0
   const totalPengeluaranPembiayaan =
      items?.find((item) => item?.kode_akun === '6.2')?.total_harga || 0
   const surplus = totalPendapatan - totalBelanja
   const netto = totalPenerimaanPembiayaan - totalPengeluaranPembiayaan
   const strSurplus = numberToRupiah(Math.abs(surplus))
   const strNetto = numberToRupiah(Math.abs(netto))
   return (
      <tbody>
         {items?.map((d) => {
            const isJumlah = d?.kode_akun?.endsWith('.X')
            return (
               <tr
                  key={d?.kode_akun}
                  className={`${d.kode_akun?.length < 6 && 'font-bold'} ${isJumlah && 'bg-foreground/5 print:bg-slate-300/20'}`}>
                  {!isJumlah && <td className='cell-print'>{d?.kode_akun}</td>}
                  <td
                     colSpan={isJumlah ? 2 : 1}
                     className={`cell-print ${isJumlah && 'text-right'}`}>
                     {d?.nama_akun}
                  </td>
                  <td className='cell-print text-right'>{numberToRupiah(d?.total_harga)}</td>
               </tr>
            )
         })}
         <tr className={`bg-foreground/5 font-bold print:bg-slate-300/30`}>
            <td
               colSpan={2}
               className={`cell-print text-right`}>
               Total Surplus / (Defisit)
            </td>
            <td
               className={`cell-print text-right ${surplus < 0 && 'text-red-500 print:text-black'}`}>
               {surplus < 0 ? `(${strSurplus})` : strSurplus}
            </td>
         </tr>
         <tr className={`bg-foreground/5 font-bold print:bg-slate-300/20`}>
            <td
               colSpan={2}
               className={`cell-print text-right`}>
               Jumlah Penerimaan Pembiayaan
            </td>
            <td className='cell-print text-right'>{numberToRupiah(totalPenerimaanPembiayaan)}</td>
         </tr>
         <tr className={`bg-foreground/5 font-bold print:bg-slate-300/20`}>
            <td
               colSpan={2}
               className={`cell-print text-right`}>
               Jumlah Pengeluaran Pembiayaan
            </td>
            <td className='cell-print text-right'>{numberToRupiah(totalPengeluaranPembiayaan)}</td>
         </tr>
         <tr className={`bg-foreground/5 font-bold print:bg-slate-300/30`}>
            <td
               colSpan={2}
               className={`cell-print text-right ${netto < 0 && 'text-red-500 print:text-black'}`}>
               Pembiayaan Neto
            </td>
            <td className={`cell-print text-right ${netto < 0 && 'text-red-500 print:text-black'}`}>
               {netto < 0 ? `(${strNetto})` : strNetto}
            </td>
         </tr>
      </tbody>
   )
}

export const TheadPerubahan = () => (
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
            colSpan={2}
            className='cell-print'>
            Jumlah (Rp)
         </th>
         <th
            rowSpan={2}
            className='cell-print'>
            Bertambah (Berkurang) (Rp)
         </th>
      </tr>
      <tr>
         <th className='cell-print'>Sebelum</th>
         <th className='cell-print'>Sesudah</th>
      </tr>
   </thead>
)

export const TbodyPerubahan = ({ items = [] }: { items: LaporanSkpd['list_rekapan'] }) => {
   return (
      <tbody>
         {items?.map((d) => {
            const selisih = (d.total_harga ?? 0) - (d.total_harga_murni ?? 0)
            const isJumlah = d?.kode_akun?.endsWith('.X')
            return (
               <tr
                  key={d?.kode_akun}
                  className={`${d.kode_akun?.length < 6 && 'font-bold'} ${isJumlah && 'bg-foreground/5 print:bg-slate-300/20'}`}>
                  {!isJumlah && <td className='cell-print'>{d?.kode_akun}</td>}
                  <td
                     colSpan={isJumlah ? 2 : 1}
                     className={`cell-print ${isJumlah && 'text-right'}`}>
                     {d?.nama_akun}
                  </td>
                  <td className='cell-print text-right'>{numberToRupiah(d?.total_harga_murni)}</td>
                  <td className='cell-print text-right'>{numberToRupiah(d?.total_harga)}</td>
                  <td className='cell-print text-right'>{numberToRupiah(selisih)}</td>
               </tr>
            )
         })}
      </tbody>
   )
}
