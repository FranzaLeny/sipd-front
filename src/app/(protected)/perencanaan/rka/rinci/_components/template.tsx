'use client'

import { forwardRef, useEffect, useState } from 'react'
import { TableAnggotaTapd } from '@components/master/tapd'
import { AnggotaTapd } from '@zod'
import { groupBy, sumBy } from 'lodash-es'
import { numberToText } from '@shared/utils'

import DetailGiat from './detail-giat'
import ListRincian from './list-rincian'
import { SubGiatWithRinci } from './rincian'
import TableCatatan from './table-catatan'
import TableGiat from './table-giat'
import TableIndikatorGiat, { TableIndikatorGiatPerubahan } from './table-indikator'
import TableKepala from './table-kepala-skpd'
import TableKop from './table-kop'
import TableSubGiat from './table-sub-giat'

const filterData = (rincian: SubGiatWithRinci['rincian'], search: string) => {
   return rincian.filter(
      (d) =>
         d.nama_standar_harga.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.kode_akun.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.nama_akun.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.nama_dana.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.nama_dana.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.group_name_7.toLocaleLowerCase().includes(search.toLowerCase()) ||
         d.spek?.toLocaleLowerCase().includes(search.toLowerCase()) ||
         String(d.harga_satuan).includes(search) ||
         String(d.total_harga).includes(search) ||
         d.group_name_8.toLocaleLowerCase().includes(search.toLowerCase())
   )
}
type Data = ReturnType<typeof filterData>

type RincianGrouped = {
   kode: string | number
   name: string
   total: number
   isKet?: boolean
   dana?: string
   total_murni: number
   list: RincianGrouped[] | Data
}

const groupRincianByLevel = (rincians: Data, groupLevel: number): RincianGrouped[] => {
   let groupedData = groupBy(
      rincians,
      (rincian) => rincian[`group_kode_${groupLevel}` as keyof typeof rincian]
   )
   return Object.entries(groupedData).map(([groupKey, groupItems]) => {
      const firstItem = groupItems[0]
      return {
         kode: groupKey,
         dana: groupLevel === 7 ? `Sumber Dana: ${firstItem?.nama_dana}` : undefined,
         isKet: groupLevel === 8,
         name: firstItem[`group_name_${groupLevel}` as keyof typeof firstItem] as string,
         total: sumBy(groupItems, 'total_harga'),
         total_murni: sumBy(groupItems, 'total_harga_murni'),
         list: groupLevel <= 7 ? groupRincianByLevel(groupItems, groupLevel + 1) : groupItems,
      }
   })
}

export type { RincianGrouped }

function THeadRincian() {
   return (
      <thead>
         <tr className='print:break-inside-avoid'>
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
               colSpan={4}
               className='cell-print'>
               Rincian Perhitungan
            </th>
            <th
               rowSpan={2}
               className='cell-print'>
               Jumlah
            </th>
         </tr>
         <tr className='print:break-inside-avoid'>
            <th className='cell-print'>Koefisien</th>
            <th className='cell-print'>Harga</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Pajak</th>
         </tr>
      </thead>
   )
}
function THeadRincianPerubahan() {
   return (
      <thead>
         <tr className='print:break-inside-avoid'>
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
               colSpan={5}
               className='cell-print'>
               Rincian Perhitungan Sebelum Perubahan
            </th>
            <th
               colSpan={5}
               className='cell-print'>
               Rincian Perhitungan Setelah Perubahan
            </th>
            <th
               className='cell-print whitespace-pre-wrap'
               rowSpan={2}>
               <div>Bertambah</div>
               <div>(Berkurang)</div>
            </th>
         </tr>
         <tr className='print:break-inside-avoid'>
            <th className='cell-print'>Koefisien</th>
            <th className='cell-print'>Harga</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Pajak</th>
            <th className='cell-print'>Jumlah</th>
            <th className='cell-print'>Koefisien</th>
            <th className='cell-print'>Harga</th>
            <th className='cell-print'>Satuan</th>
            <th className='cell-print'>Pajak</th>
            <th className='cell-print'>Jumlah</th>
         </tr>
      </thead>
   )
}

const Template = forwardRef<
   HTMLDivElement,
   { defaultData: SubGiatWithRinci; printPreview: boolean }
>(({ defaultData, printPreview }, ref) => {
   const [data, setData] = useState<RincianGrouped[]>([])
   const [filterValue, setFilterValue] = useState('')
   const [dataTapd, setDataTapd] = useState<AnggotaTapd[]>()

   const subKegiatan = defaultData?.sub_kegiatan
   const isPerubahan = !!defaultData?.jadwal?.is_perubahan

   useEffect(() => {
      if (defaultData?.rincian?.length) {
         if (filterValue) {
            const newData = filterData(defaultData?.rincian, filterValue)
            setData(groupRincianByLevel(newData, 1))
         } else {
            setData(groupRincianByLevel(defaultData?.rincian, 1))
         }
      }
   }, [filterValue, defaultData?.rincian])

   const canEdit = defaultData?.jadwal?.is_active === 1

   useEffect(() => {
      if (defaultData?.skpd?.tapd?.length) {
         setDataTapd(defaultData?.skpd?.tapd)
      }
   }, [defaultData?.skpd?.tapd])

   return (
      <div
         ref={ref}
         className={`rounded-medium mb-10 size-fit min-w-full p-2 sm:py-4 print:m-0 print:rounded-none print:p-0  ${isPerubahan ? 'text-sm print:text-xs' : 'text-sm'} print:bg-white print:text-black`}>
         <TableKop
            isPerubahan={isPerubahan}
            tahun={subKegiatan?.tahun}
            printPreview={printPreview}
         />
         <div className='h-2' />
         {subKegiatan && (
            <>
               <TableGiat printPreview={printPreview}>
                  <DetailGiat subKegiatan={subKegiatan} />
               </TableGiat>
               <div className='h-2' />
               {isPerubahan ? (
                  <TableIndikatorGiatPerubahan
                     {...{
                        printPreview,
                        capaian_bl_giat: subKegiatan.capaian_bl_giat,
                        capaian_bl_giat_murni: subKegiatan.capaian_bl_giat_murni,
                        hasil_bl_giat: subKegiatan.hasil_bl_giat,
                        hasil_bl_giat_murni: subKegiatan.hasil_bl_giat_murni,
                        output_bl_giat: subKegiatan.output_bl_giat,
                        output_bl_giat_murni: subKegiatan.output_bl_giat_murni,
                        pagu: subKegiatan.pagu,
                        pagu_murni: subKegiatan.pagu_murni,
                     }}
                  />
               ) : (
                  <TableIndikatorGiat
                     {...{
                        printPreview,
                        capaian_bl_giat: subKegiatan.capaian_bl_giat,
                        hasil_bl_giat: subKegiatan.hasil_bl_giat,
                        output_bl_giat: subKegiatan.output_bl_giat,
                        pagu: subKegiatan.pagu,
                     }}
                  />
               )}
               <div className='h-2' />
               <TableSubGiat subKegiatan={subKegiatan} />
            </>
         )}

         <div className='h-2' />
         <table className='min-w-full'>
            {isPerubahan ? <THeadRincianPerubahan /> : <THeadRincian />}
            <tbody>
               <ListRincian
                  data={data}
                  canEdit={canEdit}
                  isPerubahan={isPerubahan}
                  printPreview={printPreview}
               />
               <tr className='print:break-inside-avoid'>
                  <td
                     colSpan={6}
                     className='cell-print text-right font-semibold'>
                     Jumlah :
                  </td>
                  {isPerubahan ? (
                     <>
                        <td className='cell-print text-right font-semibold'>
                           {numberToText(subKegiatan?.pagu_murni)}
                        </td>
                        <td
                           colSpan={4}
                           className='cell-print text-right font-semibold'></td>
                        <td className='cell-print text-right font-semibold'>
                           {numberToText(subKegiatan?.pagu || 0)}
                        </td>
                     </>
                  ) : (
                     <td className='cell-print text-right font-semibold'>
                        {numberToText(subKegiatan?.pagu || 0)}
                     </td>
                  )}
                  {isPerubahan && (
                     <td className='cell-print text-right font-semibold'>
                        {numberToText(
                           (subKegiatan?.pagu || 0) - (subKegiatan?.pagu_murni || 0),
                           0,
                           true
                        )}
                     </td>
                  )}
               </tr>
            </tbody>
         </table>
         <TableKepala
            printPreview={printPreview}
            nama_jabatan_kepala={defaultData?.skpd?.sub_skpd?.nama_jabatan_kepala}
            nama_kepala={defaultData?.skpd?.sub_skpd?.nama_kepala}
            nip_kepala={defaultData?.skpd?.sub_skpd?.nip_kepala}
            pangkat_kepala={defaultData?.skpd?.sub_skpd?.pangkat_kepala}
         />
         <div className='h-2' />
         <TableCatatan printPreview={printPreview} />
         <div className='h-2' />
         <TableAnggotaTapd
            values={dataTapd}
            onChange={setDataTapd}
            show={printPreview}
         />
      </div>
   )
})
Template.displayName = 'Template'
// display name

export default Template
